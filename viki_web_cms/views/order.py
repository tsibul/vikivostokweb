from django.http import JsonResponse


def order_list(request):
    context = {}
    return JsonResponse(context)