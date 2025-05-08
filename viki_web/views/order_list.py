from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.utils import timezone

from viki_web_cms.models import UserExtension, Order, OrderState


@login_required
def order_list(request):
    """
    Order list page view displaying user orders
    with current and completed sections
    """
    # Get user extension
    user_extension = get_object_or_404(UserExtension, user=request.user)
    
    # Get search parameter for order number
    search_query = request.GET.get('order_no', '').strip()
    
    # Get active orders using optimized method
    active_orders = Order.get_active_orders_for_user(user_extension)
    
    # Apply search filter if provided
    if search_query:
        active_orders = active_orders.filter(order_no__icontains=search_query)
    
    # Get completed orders using optimized method
    completed_orders = Order.get_completed_orders_for_user(user_extension)
    
    # Apply search filter if provided
    if search_query:
        completed_orders = completed_orders.filter(order_no__icontains=search_query)
    
    # Paginate completed orders
    paginator = Paginator(completed_orders, 10)  # 10 orders per page
    page_number = request.GET.get('page', 1)
    completed_page = paginator.get_page(page_number)
    
    # Check for price changes
    price_changes_found = check_for_price_changes(active_orders)
    
    # Create context
    context = {
        'active_orders': active_orders,
        'completed_orders': completed_page,
        'search_query': search_query,
        'price_changes_found': price_changes_found
    }
    
    return render(request, 'order_list.html', context)


def check_for_price_changes(orders):
    """
    Проверяет изменения цен и применяет изменение состояния заказа
    Использует метод модели для проверки возможности изменения
    Самостоятельно выполняет изменение состояния
    
    :param orders: QuerySet заказов для проверки
    :return: True если найдены и применены изменения, False в противном случае
    """
    # Получить состояние price_changed
    try:
        price_changed_state = OrderState.objects.get(action='price_changed')
    except OrderState.DoesNotExist:
        # Если состояние не существует, выходим
        return False
    
    found_changes = False
    current_date = timezone.now().date()
    
    # Проверяем только заказы с состоянием < 8 и не в price_changed
    for order in orders.filter(state__order__lt=8).exclude(state__action='price_changed'):
        # Проверка изменений цен с помощью метода модели
        if Order.has_price_changes(order, current_date):
            # Изменяем состояние заказа
            order.previous_state = order.state
            order.state = price_changed_state
            order.state_changed_at = timezone.now()
            order.save()
            found_changes = True
            
    # Возвращаем True если были найдены изменения
    return found_changes


@login_required
def order_action(request):
    """
    AJAX handler for order actions:
    - approve branding
    - approve/decline price changes
    - cancel order
    - send comments
    """
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'})
    
    action = request.POST.get('action')
    order_id = request.POST.get('order_id')
    
    try:
        # Get the order
        order = Order.objects.select_related('state').get(
            id=order_id, 
            user_extension__user=request.user
        )
        
        # Perform requested action
        if order.state.action == 'wait_branding_approve':
            action_change_state(order, 'branding_approved')
            return JsonResponse({'status': 'success'})

        elif action == 'approve-price' and order.state.action == 'price_changed':
            action_change_state(order, 'new_price_approved')
            return JsonResponse({'status': 'success'})

        elif action == 'cancel-order' and order.state.order < 8:
            action_change_state(order, 'order_cancelled')
            return JsonResponse({'status': 'success'})

        elif action == 'send-comment':
            # Process comment (not stored in DB, just sent as notification)
            comment = request.POST.get('comment', '')
            if not comment.strip():
                return JsonResponse({'status': 'error', 'message': 'Комментарий не может быть пустым'})
                
            # Here would be code to send email or notification with the comment
            # This is a placeholder for future implementation
            
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Недопустимое действие или состояние'})
        
    except Order.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Заказ не найден'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


def action_change_state(order: Order, state: str):
    approved_state = OrderState.objects.get(action=state)
    order.previous_state = order.state
    order.state = approved_state
    order.state_changed_at = timezone.now()
    order.save()
    return JsonResponse({'status': 'success'})


@login_required
def order_files(request):
    """
    Returns files associated with an order
    """
    order_id = request.GET.get('order_id')
    
    try:
        order = Order.objects.get(id=order_id, user_extension__user=request.user)
        
        files = []
        
        if order.invoice_file:
            files.append({
                'name': 'Счет',
                'url': order.invoice_file.url
            })
            
        if order.order_file:
            files.append({
                'name': 'Заказ',
                'url': order.order_file.url
            })
            
        if order.branding_file:
            files.append({
                'name': 'Макет',
                'url': order.branding_file.url
            })
            
        return JsonResponse({'status': 'success', 'files': files})
        
    except Order.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Заказ не найден'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})