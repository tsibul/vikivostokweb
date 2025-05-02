from django.http import JsonResponse

from viki_web_cms import models
from viki_web_cms.functions.field_validation import goods_validation, dictionary_fields_validation, color_validation
from viki_web_cms.functions.reformat_field_dictionary import reformat_field_dictionary
from viki_web_cms.functions.user_validation import user_check
from viki_web_cms.views import add_annotations_for_properties


def edit_dictionary(request, class_name, element_id):
    """

    :param element_id:
    :param request:
    :param class_name:
    :return:
    """
    if user_check(request):
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    fields = dict_model.dictionary_fields()
    errors = dictionary_fields_validation(fields, request.POST)
    if element_id == 0:
        if class_name == 'Color':
            errors = color_validation(errors, request.POST)
        if class_name == 'Goods':
            errors = goods_validation(errors, request.POST)
    if errors:
        return JsonResponse({'errors': errors}, safe=False)
    post_data = request.POST.dict()
    params = reformat_field_dictionary(class_name)
    field_list = dict_model.dictionary_fields()
    fields_out = ['id']
    for field in field_list:
        if field['type'] == 'foreign' and field['foreignClass'] == 'User':
            current_field = field['field'] + '__username'
        elif field['type'] == 'foreign':
            current_field = field['field'] + '__name'
        else:
            current_field = field['field']
        fields_out.append(current_field)
        if not 'property_off' in field:
            if field['type'] == 'boolean':
                post_data[current_field] = current_field in post_data
            elif field['type'] == 'file':
                post_data[current_field] = request.FILES.get(current_field)
            elif field['type'] in ['number', 'float', 'precise']:
                if current_field in post_data == '':
                    post_data[current_field] = 0
    if element_id == 0:
        new_item = dict_model(**post_data)
        response = new_item.save()
        if isinstance(response, dict) and 'errors' in response:
            return JsonResponse({'errors': response['errors']}, safe=False)
        element_id = new_item.id
    else:
        dict_element = dict_model.objects.get(pk=element_id)
        for key, value in post_data.items():
            setattr(dict_element, key, value)
        response = dict_element.save()
        if isinstance(response, dict) and 'errors' in response:
            return JsonResponse({'errors': response['errors']}, safe=False)
    editing_item_request = dict_model.objects.filter(pk=element_id)
    editing_item = add_annotations_for_properties(editing_item_request, field_list)
    record = editing_item.values(*fields_out)
    return JsonResponse({'errors': None, 'values': record[0], 'params': params}, safe=False)


