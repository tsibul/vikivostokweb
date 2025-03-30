from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect

from viki_web_cms.models import StandardPriceType, ProductGroup


@login_required
def cabinet(request):
    categories = ProductGroup.objects.all()
    context = {'user': request.user, 'categories': categories}
    return render(request, 'cabinet.html', context)


@login_required
def cabinet_data(request):
    user = request.user
    if user.is_authenticated:
        personal_data = collect_personal_data(user)
        context = {'personalData': personal_data}
        return JsonResponse({'status': 'ok', 'data': context})
    else:
        return redirect('main')


def collect_personal_data(user):
    price_data = StandardPriceType.objects.filter(group__in=user.groups.all()).first()
    price = ''
    if price_data:
        price = price_data.name
    return {
        'email': user.email,
        'first-name': user.first_name,
        'last-name': user.last_name,
        'price': price,
    }
