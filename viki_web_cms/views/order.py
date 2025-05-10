from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Prefetch

from viki_web_cms.functions.user_validation import user_check
from viki_web_cms.models import Order, OrderItem, OrderItemBranding

@login_required
def order_list(request):
    """
    Order list API endpoint returning user orders data as JSON
    """
    if user_check(request):
        return JsonResponse({"dataList": [], "last_record": 0})

    search_query = request.GET.get('search', '')
    new_only = request.GET.get('new', '') == '1'
    last_record = int(request.GET.get('last_record', 0))
    
    if new_only:
        orders = Order.objects.filter(state__order__lte=9)
    else:
        orders = Order.objects.all()
        
    if search_query:
        orders = orders.filter(order_no__icontains=search_query)
    
    # Сортировка по дате и номеру заказа по убыванию
    orders = orders.order_by('-order_date', '-order_no')
    
    # Оптимизируем запросы с помощью prefetch_related
    orders = orders.prefetch_related(
        Prefetch(
            'orderitem_set',
            queryset=OrderItem.objects.select_related('item').prefetch_related(
                Prefetch(
                    'orderitembranding_set',
                    queryset=OrderItemBranding.objects.select_related('print_type', 'print_place')
                )
            )
        )
    )[last_record:last_record + 20]
            
    orders_data = []
    for order in orders:
        order_items = []
        for item in order.orderitem_set.all():
            item_data = {
                'id': item.id,
                'article': item.item.item_article,
                'name': item.item.name,
                'quantity': item.quantity,
                'price': item.price,
                'total_price': item.total_price,
                'branding_name': item.branding_name,
                'brandings': [{
                    'id': branding.id,
                    'print_type': branding.print_type.name,
                    'print_place': branding.print_place.name,
                    'colors': branding.colors,
                    'second_pass': branding.second_pass,
                    'price': branding.price,
                    'total_price': branding.total_price
                } for branding in item.orderitembranding_set.all()]
            }
            order_items.append(item_data)
            
        order_data = {
            'id': order.id,
            'order_no': order.order_no,
            'order_date': order.order_date.strftime('%d.%m.%y'),
            'our_company': order.our_company.short_name,
            'company': order.company.name,
            'state_id': order.state.id,
            'state': order.state.name,
            'manager': f"{order.user_extension.user.first_name} {order.user_extension.user.last_name}",
            'manager_id': order.user_extension.id,
            'manager_mail': order.user_extension.user.email,
            'responsible': order.user_responsible.first_name,
            'responsible_id': order.user_responsible.id,
            'days_to_deliver': order.days_to_deliver,
            'delivery_date': order.delivery_date.strftime('%d.%m.%y') if order.delivery_date else None,
            'branding': order.branding_file is not None,
            'invoice': order.invoice_file is not None,
            'delivery': order.delivery_file is not None,
            'state_changed_at': order.state_changed_at.strftime('%d.%m.%y') if order.state_changed_at else None,
            'total_amount': order.total_amount,
            'delivery_option': order.delivery_option.name,
            'delivery_option_id': order.delivery_option.id,
            'delivery_option_price': order.delivery_option.price,
            'items': order_items
        }
        orders_data.append(order_data)
        
    return JsonResponse({
        'dataList': orders_data,
        'last_record': last_record + len(orders_data),
    })