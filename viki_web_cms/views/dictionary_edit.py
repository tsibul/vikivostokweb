import re

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms import models
from viki_web_cms.functions.reformat_field_dictionary import reformat_field_dictionary
from viki_web_cms.functions.user_validation import user_check
from viki_web_cms.models import Color, Goods


@csrf_exempt
def edit_dictionary(request, class_name, element_id):
    """

    :param element_id:
    :param request:
    :param class_name:
    :return:
    """
    user_check(request)
    dict_model = getattr(models, class_name)
    fields = dict_model.dictionary_fields()
    errors = dictionary_fields_validation(fields, request.POST)
    if element_id == 0:
        if class_name == 'Color':
            errors = color_validation(errors, request.POST)
        if class_name == 'Goods':
            errors = goods_validation(errors, request.POST)
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
    if element_id == 0:
        new_item = dict_model(**post_data)
        new_item.save()
        element_id = new_item.id
    else:
        dict_element = dict_model.objects.get(pk=element_id)
        for key, value in post_data.items():
            setattr(dict_element, key, value)
        dict_element.save()
    editing_item = dict_model.objects.filter(pk=element_id)
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
                pattern = r'^[a-zA-Zа-яА-ЯёЁ0-9 -_#.]*$'
                if field['field'] == 'pantone':
                    pattern = r'^[a-zA-Zа0-9 ]*$'
                if not (re.fullmatch(pattern, field_values[field['field']])
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
    validate if field is not null
    :param field:
    :param value:
    :return:
    """
    null_validation = not ('null' in field and not field['null'] and value == '')
    return null_validation


def color_validation (errors, value):
    """
    validate for color copies
    :param errors:
    :param value:
    :return:
    """
    color_old = Color.objects.filter(code=value['code'], color_scheme__id=value['color_scheme_id'], deleted=False)
    if color_old:
        if not 'code' in errors:
            errors.append('code')
        if not 'color_scheme_id' in errors:
            errors.append('color_scheme_id')
    return errors

def pantone_validation(value):
    if value[-2] != ' C':
        return False

def goods_validation(errors, value):
    goods_old = Goods.objects.filter(article=value['article'], name__icontains=value['name'], deleted=False)
    if goods_old:
        if not 'article' in errors:
            errors.append('article')
        if not 'name' in errors:
            errors.append('name')
    return errors