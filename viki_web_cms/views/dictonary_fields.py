import json

from django.http import JsonResponse

from viki_web_cms import models
from viki_web_cms.functions.reformat_field_dictionary import reformat_field_dictionary


def field_names(request, class_name):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    dict_fields = dict_model.dictionary_fields()
    return JsonResponse(dict_fields, safe=False)


def field_values(request, class_name, deleted, first_record, search_string):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    if not deleted:
        field_values_request = dict_model.objects.filter(deleted=False).order_by(*dict_model.order_default())[first_record: first_record + 20]
    else:
        field_values_request = dict_model.objects.all().order_by(*dict_model.order_default())[first_record: first_record + 20]
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    field_list = dict_model.dictionary_fields()
    fields_out = []
    for field in field_list:
        fields_out.append(field['field']) if field['type'] != 'foreign' else fields_out.append(
            field['field'] + '__name')
    field_params = reformat_field_dictionary(class_name)
    values = list(field_values_request.values(*fields_out))
    context = {'field_params': field_params, 'values': values}
    return JsonResponse(context, safe=False)
