from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
import json

from viki_web_cms.models import ProductGroup, Customer, Company, UserExtension, Goods


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
    companies = Company.objects.filter(customer=customer, deleted=False)
    
    # Default context
    context = {
        'categories': categories,
        'user': request.user,
        'user_extension': user_extension,
        'customer': customer,
        'companies': list(companies),
        'cart_items': [],
    }

    # Process cart data if POST request
    if request.method == 'POST' and 'cart_data' in request.POST:
        cart_data = json.loads(request.POST.get('cart_data', '[]'))
        for item in cart_data:
            item['total'] = item['quantity'] * item['price']
            if item['branding']:
                for branding in item['branding']:
                    second_pass_mult = 1.3 if branding['secondPass'] else 1
                    branding['price'] = branding['price'] * branding['colors'] * second_pass_mult
                    branding['total'] = branding['price'] * item['quantity']
        context['cart_items'] = cart_data

    return render(request, 'order.html', context) 