import re

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms import models


@csrf_exempt
def edit_dictionary(request, class_name):
    """

    :param request:
    :param class_name:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    fields = dict_model.dictionary_fields()
    if not dictionary_fields_validation(fields, request.POST):
        return JsonResponse(None, safe=False)
    # for field in fields:

    return JsonResponse({}, safe=False)


def dictionary_fields_validation(fields, field_values):
    """

    :param fields:
    :param field_values:
    :return:
    """
    for field in fields:
        match field['type']:
            case 'number':
                if (not re.fullmatch(r'^[0-9]*$', field_values[field['field']])
                        and field_null_validation(field, field_values[field['field']])):
                    return False
            case 'string':
                if (not re.fullmatch(r'^[a-zA-Zа-яА-ЯёЁ0-9 _#]*$', field_values[field['field']])
                        and field_null_validation(field, field_values[field['field']])):
                    return False
            case 'boolean':
                if field['field'] in field_values and field_values[field['field']] != 'on':
                    return False
            # case 'file':
            #     if not re.fullmatch(r'^[a-zA-Zа-яА-ЯёЁ0-9 _]*$', field_values[field['field']]):
            #         return False
            case 'foreign':
                if (not re.fullmatch(r'^[0-9]*$', field_values[field['field'] + '_id'])
                    and field_null_validation(field, field_values[field['field'] + '_id'])):
                    return False
            # case 'image':
            #     pass
            case _:
                pass
    return True


def field_null_validation(field, value):
    """

    :param field:
    :param value:
    :return:
    """
    return not ('null' in field and not field['null'] and value == '')
