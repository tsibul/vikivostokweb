import json
import re

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms import models
from viki_web_cms.functions.reformat_field_dictionary import reformat_field_dictionary


@csrf_exempt
def edit_dictionary(request, class_name, elementId):
    """

    :param request:
    :param class_name:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    fields = dict_model.dictionary_fields()
    errors = dictionary_fields_validation(fields, request.POST)
    if errors :
        return JsonResponse({'errors': errors}, safe=False)
    post_data = request.POST.dict()
    params = reformat_field_dictionary(class_name)
    field_list = dict_model.dictionary_fields()
    fields_out = ['id']
    for field in field_list:
        current_field = field['field'] + '__name' if field['type'] == 'foreign' else field['field']
        fields_out.append(current_field)
        if field['type'] == 'boolean':
            post_data[current_field] =  current_field in post_data
    if elementId == 0:
        editing_item = dict_model(**post_data)
        editing_item.save()
    else:
        dict_model.objects.filter(pk=elementId).update(**post_data)
        editing_item = dict_model.objects.filter(pk=elementId)
    record = editing_item.values(*fields_out)
    return JsonResponse({'errors': None, 'values': record[0], 'params': params}, safe=False)


def dictionary_fields_validation(fields, field_values):
    """

    :param fields:
    :param field_values:
    :return:
    """
    errors = []
    for field in fields:
        match field['type']:
            case 'number':
                if (not re.fullmatch(r'^[0-9]*$', field_values[field['field']])
                        and field_null_validation(field, field_values[field['field']])):
                    errors.append(field['field'])
            case 'string':
                if (not re.fullmatch(r'^[a-zA-Zа-яА-ЯёЁ0-9 _#]*$', field_values[field['field']])
                        and field_null_validation(field, field_values[field['field']])):
                    errors.append(field['field'])
            case 'boolean':
                if field['field'] in field_values and field_values[field['field']] != 'on':
                    errors.append(field['field'])
            # case 'file':
            #     if not re.fullmatch(r'^[a-zA-Zа-яА-ЯёЁ0-9 _]*$', field_values[field['field']]):
            #         return False
            case 'foreign':
                if (not re.fullmatch(r'^[0-9]*$', field_values[field['field'] + '_id'])
                    and field_null_validation(field, field_values[field['field'] + '_id'])):
                    errors.append(field['field'])
            # case 'image':
            #     pass
            case _:
                pass
    return errors


def field_null_validation(field, value):
    """

    :param field:
    :param value:
    :return:
    """
    return not ('null' in field and not field['null'] and value == '')
