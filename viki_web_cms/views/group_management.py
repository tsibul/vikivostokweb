from django.http import JsonResponse
from django.db.models import F, Subquery, OuterRef, CharField, Func, Value
from django.db.models.functions import Concat, Cast, Replace

from viki_web_cms.models.customer_models import Customer, Company
from viki_web_cms.functions.user_validation import user_check


def get_customer_list(request):
    """
    Returns a list of customers with their associated companies
    """
    if user_check(request):
        return JsonResponse(None, safe=False)

    companies = Company.objects.filter(
        customer=OuterRef('id'),
        deleted=False
    ).annotate(
        escaped_name=Replace('name', Value('"'), Value('\\"')),
        company_data=Concat(
            Value('{"id":'), Cast(F('id'), output_field=CharField()), Value(','),
            Value('"inn":"'), F('inn'), Value('",'),
            Value('"name":"'), F('escaped_name'), Value('",'),
            Value('"vat":'), Cast(F('vat'), output_field=CharField()),
            Value('}')
        )
    ).values(
        'customer'
    ).annotate(
        company_list=Concat(
            Value('['),
            Func(F('company_data'), function='GROUP_CONCAT'),
            Value(']')
        )
    ).values('company_list')

    customers = Customer.objects.filter(
            deleted=False
        ).annotate(
            alias=F('e_mail_alias'),
            priceType=F('standard_price_type__name'),
            managerName=Concat(
                F('manager__first_name'),
                Value(' '),
                F('manager__last_name')
            ),
            companySet=Subquery(
                companies,
                output_field=CharField()
            )
        ).values(
            'id',
            'name',
            'new',
            'alias',
            'priceType',
            'managerName',
            'companySet'
        )

    context = {
        'status': 'success',
        'dataList': list(customers)
    }

    return JsonResponse(context, safe=False)