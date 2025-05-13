from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.db.models import Prefetch

from viki_web_cms.functions.user_validation import user_check
from viki_web_cms.models import Order, OrderItem, OrderItemBranding, DeliveryOption, OrderState, PrintType, PrintPlace


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


@login_required
def order_modal_request(request):
    if user_check(request):
        return JsonResponse({})

    edit_type = request.GET.get('type', '')
    element_id = request.GET.get('id', '')

    match edit_type:
        case 'editDelivery':
            delivery = Order.objects.get(id=int(element_id)).delivery_option
            return JsonResponse(delivery.get_delivery_options(), safe=False)
        case 'editItem':
            order_item = OrderItem.objects.get(id=int(element_id))
            if order_item.has_branding():
                return JsonResponse({'price': order_item.price, 'branding_name': order_item.branding_name})
            else:
                return JsonResponse({'price': order_item.price})
        case 'editBranding':
            branding_item = OrderItemBranding.objects.get(id=int(element_id))
            return JsonResponse(branding_item.get_branding_modal_data())
        case 'editOrder':
            order = Order.objects.get(id=int(element_id))
            return JsonResponse(order.get_order_modal_data())
    return JsonResponse({})


@login_required
def order_edit(request):
    if user_check(request):
        return JsonResponse({})
    edit_type = request.POST.get('type')
    element_id = request.POST.get('element_id')
    new_price_state = OrderState.objects.get(order=5)

    match edit_type:
        case 'editDelivery':
            delivery_id = request.POST.get('id')
            order = Order.objects.get(id=int(element_id))
            old_price = order.delivery_option.price
            delivery = DeliveryOption.objects.get(id=int(delivery_id))
            order.delivery_option = delivery
            if old_price == delivery.price:
                order.save()
                context = {'delivery_option': delivery.name, 'delivery_option_id': delivery.id}
            else:
                order.state = new_price_state
                order.save()
                order.recalculate_order_partial()
                context = {
                    'delivery_option': order.delivery_option.name,
                    'delivery_option_id': order.delivery_option.id,
                    'price': order.delivery_option.price,
                    'total_amount': order.total_amount,
                }
        case 'editItem':
            order_item = OrderItem.objects.get(id=int(element_id))
            price = round(float(request.POST.get('price')),2)
            branding_name = request.POST.get('branding_name')
            if price == order_item.price:
                order_item.branding_name = branding_name
                order_item.save()
                context = {'branding_name': order_item.branding_name}
            else:
                order_item.branding_name = branding_name
                order_item.price = price
                order_item.save()
                order = order_item.order
                order.state = new_price_state
                order.save()
                order.recalculate_order_partial()
                context = {
                    'branding_name': order_item.branding_name,
                    'price': order_item.price,
                    'total_price': order_item.total_price,
                    'total_amount': order.total_amount,
                }
        case 'editBranding':
            branding_item = OrderItemBranding.objects.get(id=int(element_id))
            order = branding_item.order_item.order
            print_type_id = int(request.POST.get('print_type__id'))
            print_place_id = int(request.POST.get('print_place__id'))
            colors = int(request.POST.get('colors'))
            second_pass = request.POST.get('second_pass') == 'on'
            print_type = PrintType.objects.get(id=print_type_id)
            print_place = PrintPlace.objects.get(id=print_place_id)
            branding_item.print_type = print_type
            branding_item.print_place = print_place
            branding_item.colors = colors
            branding_item.second_pass = second_pass
            base_price = branding_item.get_print_base_price()
            second_pass_multiplier = 1.3 if second_pass else 1
            old_price = branding_item.price
            branding_item.price = round(base_price*colors*second_pass_multiplier, 2)
            branding_item.save()
            if branding_item.price != old_price:
                order.state = new_price_state
                order.save()
                order.recalculate_order_partial()
            branding_text = f"{branding_item.print_type.name} {branding_item.print_place.name}, цветов {branding_item.colors}"
            if branding_item.second_pass:
                branding_text += ', второй проход'
            context = {
                'brandingText': branding_text,
                'branding_price': branding_item.price,
                'total_price': branding_item.total_price,
                'total_amount': order.total_amount,
            }
        case 'editOrder':
            order = Order.objects.get(id=int(element_id))
            state_id = request.POST.get('state')
            state = OrderState.objects.get(id=int(state_id))
            if state != order.state:
                order.state = state
            days_to_deliver = int(request.POST.get('days_to_deliver'))
            if days_to_deliver and days_to_deliver != order.days_to_deliver:
                order.days_to_deliver = days_to_deliver
            delivery_date = request.POST.get('delivery_date')
            if delivery_date and delivery_date != order.delivery_date:
                order.delivery_date = delivery_date
            user_responsible_id = request.POST.get('user_responsible_id')
            if user_responsible_id and int(user_responsible_id) != order.user_responsible.id:
                user_responsible = User.objects.get(id=int(user_responsible_id))
                order.user_responsible = user_responsible
            order.save()
            context = {
                'state': order.state,
                'days_to_deliver': order.days_to_deliver,
                'delivery_date': delivery_date,
                'user_responsible_id': order.user_responsible.first_name,
            }
        case _:
            context = {}

    return JsonResponse(context)
