from django.http import JsonResponse


def catalogue_csv_load(request):
    return JsonResponse({}, safe=False)