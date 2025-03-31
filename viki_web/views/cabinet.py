from unittest import case

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect

from viki_web.functions.field_validation import name_validation, phone_validation
from viki_web_cms.models import StandardPriceType, ProductGroup, UserExtension


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
    phone = ''
    user_phone = UserExtension.objects.filter(user=user).first()
    if user_phone:
        phone = user_phone.phone
    if price_data:
        price = price_data.name
    return {
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'price': price,
        'phone': phone,
    }


def cabinet_save(request, form_type):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Ошибка авторизации'})
    if request.method == 'POST':
        match form_type:
            case 'personal':
                return save_personal_data(request)
            case 'company':
                return save_company_data(request)
            case 'bank':
                return save_bank_data(request)
    return JsonResponse({'status': 'error', 'message': 'Ошибка запроса'})


def save_personal_data(request):
    user = request.user
    user_phone = UserExtension.objects.filter(user=user).first()
    if request.POST['phone']:
        if phone_validation(request.POST['phone']):
            if user_phone:
                user_phone.phone = request.POST['phone']
                user_phone.save()
            else:
                UserExtension.objects.create(phone=request.POST['phone'], user=user)
        else:
            return JsonResponse({'status': 'error', 'message': 'Ошибка в номере телефона', 'field': 'phone'})
    if name_validation(request.POST['first_name']):
        user.first_name = request.POST['first_name']
    else:
        return JsonResponse({'status': 'error', 'message': 'Неверный формат имени', 'field': 'first_name'})
    if name_validation(request.POST['last_name']):
        user.last_name = request.POST['last_name']
    else:
        return JsonResponse({'status': 'error', 'message': 'Неверный формат фамилии', 'field': 'last_name'})
    user.save()
    return JsonResponse({'status': 'ok'})


def save_company_data(request):
    return JsonResponse({'status': 'ok'})


def save_bank_data(request):
    return JsonResponse({'status': 'ok'})
