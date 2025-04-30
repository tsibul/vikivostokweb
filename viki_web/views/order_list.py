from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from viki_web_cms.models import Company, UserExtension, ProductGroup


@login_required
def order_list(request):
    """
    Order list page view
    Requires user to be authenticated
    """
    # Get category data for navigation
    categories = ProductGroup.objects.filter(deleted=False)
    user_extension = UserExtension.objects.get(user=request.user)
    customer = user_extension.customer


    # Получаем компании выбранного клиента
    companies = Company.objects.filter(customer=customer, deleted=False)

    # Default context
    context = {
        'categories': categories,
        'user': request.user,
        'user_extension': user_extension,
        'customer': customer,
        'companies': list(companies),
    }


    return render(request, 'order_list.html', context)