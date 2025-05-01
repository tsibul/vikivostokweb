from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
import json

from viki_web_cms.models import ProductGroup, Customer, Company, UserExtension, Goods, StandardPriceType
from viki_web_cms.models.delivery_options import DeliveryOption


@login_required
def order(request):
    """
    Order page view
    Requires user to be authenticated
    """
    # Get category data for navigation
    categories = ProductGroup.objects.filter(deleted=False)
    user_extension = UserExtension.objects.get(user=request.user)
    customer = user_extension.customer
    
    # Обработка смены клиента для staff-пользователей
    if request.method == 'POST' and request.user.is_staff and 'customer_id' in request.POST and 'customer_change' in request.POST:
        new_customer_id = request.POST.get('customer_id')
        try:
            new_customer = Customer.objects.get(id=new_customer_id)
            # Проверяем, имеет ли новый клиент тот же тип цены
            if customer and customer.standard_price_type == new_customer.standard_price_type:
                customer = new_customer
        except Customer.DoesNotExist:
            pass
    
    # Получаем компании выбранного клиента
    companies = Company.objects.filter(customer=customer, deleted=False)
    
    # Получаем опции доставки
    delivery_options = DeliveryOption.objects.filter(deleted=False)
    
    # Default context
    context = {
        'categories': categories,
        'user': request.user,
        'user_extension': user_extension,
        'customer': customer,
        'companies': list(companies),
        'cart_items': [],
        'delivery_options': delivery_options,
    }
    
    # If user is staff, get customers with the same price_type
    if request.user.is_staff and customer and customer.standard_price_type:
        price_type = customer.standard_price_type
        available_customers = Customer.objects.filter(
            standard_price_type=price_type,
            deleted=False
        ).exclude(id=customer.id)
        context['available_customers'] = available_customers
    
    # Process cart data if POST request (корзина присутствует в обоих видах POST запросов)
    if request.method == 'POST' and 'cart_data' in request.POST:
        cart_data = json.loads(request.POST.get('cart_data', '[]'))
        for item in cart_data:
            item['total'] = item['quantity'] * item['discountPrice']
            if item['branding']:
                for branding in item['branding']:
                    second_pass_mult = 1.3 if branding['secondPass'] else 1
                    branding['price'] = round(branding['price'] * branding['colors'] * second_pass_mult, 2)
                    branding['total'] = branding['price'] * item['quantity']
        context['cart_items'] = cart_data

    return render(request, 'order.html', context) 