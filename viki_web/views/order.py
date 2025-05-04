from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
import json
from datetime import datetime
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

from viki_web_cms.models import ProductGroup, Customer, Company, UserExtension, Goods, StandardPriceType, Order, \
    CustomerDiscount, OrderState, OurCompany, CatalogueItem, OrderItem, PrintType, PrintPlace, OrderItemBranding
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


def generate_short_number ():
    today = datetime.today()
    existing_number = Order.objects.filter(
        order_date__month=today.month,
        order_date__year=today.year
    ).order_by(
        '-order_short_number').first(
    )
    return existing_number.order_short_number + 1 if existing_number else 1

def generate_order_number(manager, user_extension,  company, has_branding, short_number):
    """
    Generate order number with format:
    ddmmyy_XXX_M_D_R_B

    Where:
    - ddmmyy: current date
    - XXX: order sequential number in current month (with leading zeros)
    - M: manager letter from user_extension (or 'О' if empty)
    - D: discount code from customer price type (or empty)
    - R: 'M' for regions 77, 50, 99; 'P' for others
    - B: 'Б' if order has branding, 'Н' if not
    """
    # Current date part
    today = datetime.today()
    date_part = today.strftime('%d%m%y')
    sequence_number = f"{short_number:03d}"
    
    # Manager letter (use 'О' if empty)
    if manager:
        manager_ext = UserExtension.objects.filter(user=manager).first()
        manager_letter = manager_ext.manager_letter
    else:
        manager_letter = 'О'

    # Get discount code
    discount_code = "К"
    try:
        if user_extension.customer and user_extension.customer.standard_price_type:
            customer_discount = CustomerDiscount.objects.filter(
                price_name=user_extension.customer.standard_price_type
            ).first()
            if customer_discount:
                discount_code = customer_discount.discount_code or "К"
    except (ObjectDoesNotExist, AttributeError):
        pass
    
    # Region code (M or P)
    region_code = 'М' if company.region in ['77', '50', '99'] else 'Р'
    
    # Branding code (Б or Н)
    branding_code = 'Б' if has_branding else 'Н'
    
    # Assemble order number
    order_number = f"{date_part}_{sequence_number}_{manager_letter}_{discount_code}{region_code}_{branding_code}"
    
    return order_number


@login_required
@transaction.atomic
def create_order(request):
    """
    Process order creation and save to database
    
    Expected POST parameters:
    - user_extension_id: ID of the user extension
    - customer_id: ID of the customer
    - company_id: ID of the company
    - company_vat: VAT status of the company
    - customer_comment: Customer comment
    - delivery_option_id: ID of the delivery option
    - items: JSON string with order items
    
    Returns:
    - JSON response with status and message
    """
    if request.method != 'POST':
        return JsonResponse({
            'status': 'error',
            'message': 'Only POST method is allowed'
        }, status=405)
    
    try:
        # Get required data from request
        user_extension_id = request.POST.get('user_extension_id')
        customer_id = request.POST.get('customer_id')
        company_id = request.POST.get('company_id')
        company_vat = request.POST.get('company_vat') == 'true'
        customer_comment = request.POST.get('customer_comment', '')
        delivery_option_id = request.POST.get('delivery_option_id', '')
        delivery_option = DeliveryOption.objects.get(id=delivery_option_id)
        
        # Parse items data
        items_json = request.POST.get('items', '[]')
        items_data = json.loads(items_json)
        
        # Check if we have items
        if not items_data:
            return JsonResponse({
                'status': 'error',
                'message': 'Cart is empty'
            }, status=400)
        
        # Get required database objects
        try:
            user_extension = UserExtension.objects.get(id=user_extension_id)
            customer = Customer.objects.get(id=customer_id)
            company = Company.objects.get(id=company_id)
            
            # Get initial order state
            initial_state = OrderState.objects.filter(deleted=False).order_by('order').first()
            if not initial_state:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No order states defined in the system'
                }, status=500)
        except ObjectDoesNotExist as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Required object not found: {str(e)}'
            }, status=400)
        
        # Calculate total amount and check if we have any branding
        total_amount = 0
        has_branding = False
        
        for item in items_data:
            item_total = float(item['total'])
            total_amount += item_total
            
            # Add branding costs if any
            if item.get('branding') and len(item['branding']) > 0:
                has_branding = True
                for branding in item['branding']:
                    total_amount += float(branding['total'])
        total_amount = round(total_amount, 2)

        # Determine our company based on total and VAT status
        if total_amount > 20000 and company_vat:
            our_company = OurCompany.objects.filter(vat=True, deleted=False).order_by('priority').first()
        else:
            our_company = OurCompany.objects.filter(vat=False, deleted=False).order_by('priority').first()
        
        if not our_company:
            return JsonResponse({
                'status': 'error',
                'message': 'No suitable company found for order processing'
            }, status=500)
        
        # Generate order number
        manager = customer.manager
        order_short_number = generate_short_number()
        order_no = generate_order_number(manager, user_extension, company, has_branding, order_short_number)

        # Create order record
        new_order = Order.objects.create(
            order_no=order_no,
            order_short_number=order_short_number,
            order_date=datetime.today().date(),
            user_extension=user_extension,
            customer=customer,
            company=company,
            our_company=our_company,
            total_amount=total_amount,
            customer_comment=customer_comment,
            state=initial_state,
            delivery_option = delivery_option,
            user_edited = request.user,
            user_responsible=manager,
        )

        # new_order.save()

        # Create order items and branding records
        for item_data in items_data:
            try:
                catalogue_item = CatalogueItem.objects.get(id=item_data['id'])
                
                # Create order item
                order_item = OrderItem.objects.create(
                    order=new_order,
                    item=catalogue_item,
                    price=float(item_data['price']),
                    quantity=int(item_data['quantity']),
                    total_price=float(item_data['total']),
                    branding_name=catalogue_item.name
                )
                
                # Create branding records if any
                if item_data.get('branding') and len(item_data['branding']) > 0:
                    for branding_data in item_data['branding']:
                        print_type = PrintType.objects.get(id=branding_data['type_id'])
                        print_place = PrintPlace.objects.get(id=branding_data['location_id'])
                        
                        OrderItemBranding.objects.create(
                            order_item=order_item,
                            print_type=print_type,
                            print_place=print_place,
                            colors=int(branding_data['colors']),
                            second_pass=branding_data['second_pass'],
                            price=float(branding_data['price']),
                            total_price=float(branding_data['total'])
                        )
                        
            except ObjectDoesNotExist as e:
                # Rollback will happen automatically due to transaction.atomic
                return JsonResponse({
                    'status': 'error',
                    'message': f'Error creating order item: {str(e)}'
                }, status=400)
        
        # Execute state action if available
        if initial_state.action:
            new_order.execute_state_action(initial_state.action)
                
        # Return success response
        return JsonResponse({
            'status': 'ok',
            'message': 'Order created successfully',
            'order_id': new_order.id,
            'order_no': new_order.order_no,
            'redirect_url': '/cart'  # Redirect to cart page
        })
        
    except Exception as e:
        # Handle unexpected errors
        return JsonResponse({
            'status': 'error',
            'message': f'Unexpected error: {str(e)}'
        }, status=500) 