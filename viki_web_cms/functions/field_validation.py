import re

from viki_web_cms.models import Goods, Color


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
            case 'float':
                if (not re.fullmatch(r'^[0-9.,]*$', field_values[field['field']])
                        and field_null_validation(field, field_values[field['field']])):
                    errors.append(field['field'])
            case 'precise':
                if (not re.fullmatch(r'^[0-9.,]*$', field_values[field['field']])
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