from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect

from viki_web.functions.field_validation import name_validation, phone_validation, inn_validation
from viki_web_cms.functions.dadata_parse_inn import dadata_parse_inn
from viki_web_cms.models import ProductGroup, UserExtension, Company, BankAccount, StandardPriceType, Customer


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
        legal_data = {}
        user_extension = UserExtension.objects.filter(user=user).first()
        if user_extension:
            if user_extension.customer:
                legal_data = collect_legal_data(user_extension.customer)
        context = {'personalData': personal_data, 'legalData': legal_data}
        return JsonResponse({'status': 'ok', 'data': context})
    else:
        return redirect('main')


def collect_legal_data(customer):
    company_list = list(Company.objects.filter(
        customer=customer,
        deleted=False).order_by(
        'name').values(
        'id',
        'name',
        'inn',
        'kpp',
        'vat',
        'address',
    ))
    for company in company_list:
        company['bank'] = collect_bank_data(company['id'])
    return company_list


def collect_bank_data(company_id):
    return list(BankAccount.objects.filter(
        deleted=False,
        company__id=company_id).values(
        'id',
        'name',
        'account_no',
        'bic',
        'corr_account',
        'city',
    ))


def collect_personal_data(user):
    user_extension = UserExtension.objects.filter(user=user).first()
    price = ''
    if user_extension.customer:
        price = user_extension.customer.standard_price_type.name
    phone = ''
    if user_extension:
        phone = user_extension.phone
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
    company_id = request.POST['id']
    company = Company.objects.get(id=company_id)
    counter = 0
    if request.POST['vat'] and not company.vat:
        company.vat = True
        counter = counter + 1
    if not inn_validation(request.POST['inn']):
        return JsonResponse({'status': 'error', 'message': 'Неверный ИНН', 'field': 'inn'})
    if request.POST['inn'] != company.inn:
        company.inn = request.POST['inn']
        counter = counter + 1
        if counter:
            result = company.save()
            if isinstance(result, dict) and result.get('errors'):
                return JsonResponse(result)
            return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error', 'message': 'Ничего не поменялось', 'field': 'inn'})


def save_bank_data(request):
    return JsonResponse({'status': 'ok'})


def company_create(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Ошибка авторизации'})
    
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Ошибка запроса'})
        
    inn = request.POST['inn']
    if not inn_validation(inn):
        return JsonResponse({'status': 'error', 'message': 'Ошибка ввода ИНН'})
    
    # Проверяем существующую компанию
    company_base = Company.objects.filter(inn=inn).first()
    if not company_base:
        # Получаем данные через DaData
        result = dadata_parse_inn(inn)
        if result['errors']:
            return JsonResponse(result)
            
        company_data = result['result']
        company = {
            'name': company_data['value'],
            'inn': inn,
            'kpp': company_data['data']['kpp'],
            'ogrn': company_data['data']['ogrn'],
            'address': company_data['data']['address']['unrestricted_value'],
            'region': company_data['data']['kpp'][0:2],
            'short_name': company_data['data']['name']['full']
        }
        return JsonResponse({'status': 'ok', 'company': company})
    
    # Проверяем доступность компании
    if company_base.customer:
        user_extension = UserExtension.objects.filter(user=user).first()
        if not user_extension or user_extension.customer:
            return JsonResponse({'status': 'error', 'message': 'Компания уже есть'})
    
    company = {
        'name': company_base.name,
        'inn': inn,
        'kpp': company_base.kpp,
        'ogrn': company_base.ogrn,
        'address': company_base.address,
        'region': company_base.region,
    }
    return JsonResponse({'status': 'ok', 'company': company})


def save_new_company(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Ошибка авторизации'})
    
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Ошибка запроса'})
    
    try:
        # Проверяем существующую компанию
        company_base = Company.objects.filter(inn=request.POST['inn']).first()
        
        # Получаем user_extension
        user_extension = UserExtension.objects.filter(user=user).first()
        
        if company_base:
            # Компания уже существует
            if company_base.customer:
                # Компания привязана к Customer
                if user_extension and user_extension.customer and user_extension.customer != company_base.customer:
                    # User привязан к другому Customer
                    return JsonResponse({'status': 'error', 'message': 'Компания уже есть'})
                else:
                    # Привязываем user к существующему Customer
                    if not user_extension:
                        user_extension = UserExtension(user=user)
                    user_extension.customer = company_base.customer
                    user_extension.save()
                    return JsonResponse({'status': 'ok'})
            else:
                # Компания существует, но не привязана к Customer
                if user_extension and user_extension.customer:
                    # Привязываем компанию к Customer пользователя
                    company_base.customer = user_extension.customer
                    company_base.save()
                    return JsonResponse({'status': 'ok'})
                else:
                    # Создаем нового Customer и привязываем к нему user и company
                    price_type = StandardPriceType.objects.all().order_by('priority')[0]
                    customer = Customer.objects.create(
                        name=request.POST['short_name'],
                        standard_price_type=price_type
                    )
                    company_base.customer = customer
                    company_base.save()
                    
                    if not user_extension:
                        user_extension = UserExtension(user=user)
                    user_extension.customer = customer
                    user_extension.save()
                    return JsonResponse({'status': 'ok'})
        else:
            # Создаем новую компанию
            if user_extension and user_extension.customer:
                # Привязываем новую компанию к существующему Customer пользователя
                customer = user_extension.customer
            else:
                # Создаем нового Customer
                price_type = StandardPriceType.objects.all().order_by('priority')[0]
                customer = Customer.objects.create(
                    name=request.POST['short_name'],
                    standard_price_type=price_type
                )
                
                # Привязываем user к новому Customer
                if not user_extension:
                    user_extension = UserExtension(user=user)
                user_extension.customer = customer
                user_extension.save()
            
            # Создаем новую компанию
            company = Company.objects.create(
                name=request.POST['name'],
                inn=request.POST['inn'],
                kpp=request.POST['kpp'],
                ogrn=request.POST['ogrn'],
                address=request.POST['address'],
                region=request.POST['region'],
                vat=request.POST.get('vat') == 'on',
                customer=customer
            )
            
            return JsonResponse({'status': 'ok'})
            
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
