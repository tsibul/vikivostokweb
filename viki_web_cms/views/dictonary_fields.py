from django.db.models import Q, Count, F, Value
from django.db.models.functions import Concat
from django.http import JsonResponse

from viki_web_cms import models
from viki_web_cms.functions.reformat_field_dictionary import reformat_field_dictionary
from viki_web_cms.functions.user_validation import user_check


def field_names(request, class_name):
    """
    return dictionary fields with parameters for requested class
    :param request:
    :param class_name:
    :return:
    """
    if user_check(request):
        return JsonResponse(None, safe=False)
    if not class_name:
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    dict_fields = dict_model.dictionary_fields()
    return JsonResponse(dict_fields, safe=False)


def field_values(request, class_name, deleted, first_record, search_string):
    """
    return dictionary fields with parameters (field_params) and values (values) for requested class
    :param request:
    :param class_name: requested class
    :param deleted: filter if deleted True
    :param first_record: number of first record for slice request
    :param search_string: filter for records
    :return:
    """
    if user_check(request):
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    field_list = dict_model.dictionary_fields()
    fields_out = ['id']
    fields_search = []
    for field in field_list:
        current_field = field['field'] + '__name' if field['type'] == 'foreign' else field['field']
        fields_out.append(current_field)
        if field['type'] not in {'boolean', 'image'}:
            fields_search.append(current_field + '__icontains')
    order = dict_model.order_default()
    if search_string == 'None':
        if not deleted:
            field_values_request = dict_model.objects.filter(deleted=False).order_by(*order)[
                                   first_record: first_record + 20]
        else:
            field_values_request = dict_model.objects.all().order_by(*order)[first_record: first_record + 20]
    else:
        search_string = search_string.replace('|', ' ')
        query = Q()
        for field in fields_search:
            query |= Q(**{field: search_string})
        if not deleted:
            field_values_request = dict_model.objects.filter(query, deleted=False).order_by(*order)[
                                   first_record: first_record + 20]
        else:
            field_values_request = dict_model.objects.filter(query).order_by(*order)[
                                   first_record: first_record + 20]
    field_params = reformat_field_dictionary(class_name)
    values = list(field_values_request.values(*fields_out))
    context = {'field_params': field_params, 'values': values}
    return JsonResponse(context, safe=False)


def record_info(request, class_name, record_id):
    """
    return record info for requested class and id
    :param request:
    :param class_name:
    :param record_id:
    :return:
    """
    if user_check(request):
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    url = dict_model.storage_url()
    record = dict_model.objects.filter(id=record_id).values()
    record = record[0] if len(record) else None
    return JsonResponse({'record': record, 'url': url}, safe=False)


def dropdown_list(request, class_name):
    """

    :param request:
    :param class_name:
    :return:
    """
    if user_check(request):
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    match class_name:
        case 'Goods':
            option_list = (dict_model.objects.filter(deleted=False)
                           .annotate(value=Concat(F('article'), Value(' '), F('name')))
                           .values('id', 'value'))
        case 'Color':
            option_list = (dict_model.objects.filter(deleted=False)
                           .annotate(value=Concat(F('code'), Value(' '), F('name')))
                           .values('id', 'value'))
        case 'PrintPriceGroup':
            option_list = (dict_model.objects.filter(deleted=False)
                           .annotate(value=Concat(F('print_type__name'), Value(' '), F('name')))
                           .values('id', 'value'))
        case 'Group':
            option_list = (dict_model.objects.filter(~Q(name='cms_staff'))
                       .annotate(value=F('name'))
                       .values('id', 'value'))
        case _:
            option_list = (dict_model.objects.filter(deleted=False)
                           .annotate(value=F('name'))
                           .values('id', 'value'))
    return JsonResponse(list(option_list), safe=False)
