import json

from django.contrib.auth import authenticate, login
from django.db.models.signals import post_init
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def userdata(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'username': 'Авторизуйтесь'}, safe=False)
    if user.groups:
        user_groups = [group.name for group in user.groups.all()]
        if 'cms_staff' not in user_groups:
            return JsonResponse({'username': 'Авторизуйтесь'}, safe=False)
    user_out = prepare_user_out(user)
    return JsonResponse({'username': user_out}, safe=False)


@csrf_exempt
def user_login(request):
    user = None
    post_data = json.loads(request.body)
    if len(post_data.values()):
        username = post_data['username']
        password = post_data['password']
        user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
    name = prepare_user_out(user) if user.is_authenticated else None
    return JsonResponse({'username': name}, safe=False)


def prepare_user_out(user):
    if user.first_name and user.last_name:
        user_out = user.first_name + ' ' + user.last_name
    elif not user.first_name and user.last_name:
        user_out = user.last_name
    elif user.first_name and not user.last_name:
        user_out = user.first_name
    else:
        user_out = user.username
    return user_out