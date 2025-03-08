from django.http import JsonResponse


def user_check(request):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
