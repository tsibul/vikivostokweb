from django.http import JsonResponse

from viki_web_cms import models


def field_names(request, class_name):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    dict_model = getattr(models, class_name)
    dict_fields = dict_model.dictionary_fields()
    return JsonResponse(dict_fields, safe=False)


def field_values(request, class_name, deleted=0, first_record=0):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    return JsonResponse({})
