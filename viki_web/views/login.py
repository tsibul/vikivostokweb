import random

from django.core.cache import cache

import string
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django_ratelimit.decorators import ratelimit

from viki_web_cms.models import UserExtension


def generate_temp_password(length=12):
    """
    temporary password generator
    :param length: password length
    :return:
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


@ratelimit(key='ip', rate='3/h', method='POST', block=False)
def send_temp_password(request):
    """
    send temporary password by email
    :param request:
    :return:
    """
    if getattr(request, 'limited', False):
        return JsonResponse({"status": "error", "message": "Слишком много запросов. Попробуйте позже."},
                            status=429)
    if request.method == "POST":
        email = request.POST.get("email")
        user_type = request.POST.get("user-type")
        temp_password = generate_temp_password()
        if user_type == "new":
            if User.objects.filter(email=email).exists():
                return JsonResponse({"status": "error", "message": "Пользователь уже зарегистрирован"})
        elif user_type == "old":
            if not User.objects.filter(email=email).exists():
                return JsonResponse({"status": "error", "message": "Пользователь не найден"})
        old_password = cache.get(f"temp_pass_{email}")
        if old_password is not None:
            cache.delete(f"temp_pass_{email}")
        cache.set(f"temp_pass_{email}", temp_password, timeout=600)
        send_mail(
            "Ваш пароль на vikivostok.ru",
            f"Ваш пароль: {temp_password}, вы можете поменять его позднее",
            "no-reply@vikivostok.ru",
            [email],
            fail_silently=False,
        )
        return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error", 'message': 'не удалось отправить почту'})


def login_with_temp_password(request):
    """
    login with temporary password
    :param request:
    :return:
    """
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        user_type = request.POST.get("user-type")
        temp_password = cache.get(f"temp_pass_{email}")
        if temp_password and password == temp_password:
            if user_type == "new":
                user = User.objects.create_user(username=email, email=email, password=password)
                user_extension = UserExtension(user=user)
                user_extension.save()
                login(request, user)
            elif user_type == "old":
                if not User.objects.filter(email=email).exists():
                    return JsonResponse({"status": "error", "message": "Пользователь не найден"})
                user = User.objects.get(email=email)
                user.set_password(temp_password)
                user.save()
                login(request, user)
            cache.delete(f"temp_pass_{email}")
            return JsonResponse({"status": "ok"})
        return JsonResponse({"status": "error", "message": "Неверный временный пароль"})
    return JsonResponse({"status": "error", "message": "Ошибка ввода"})


@login_required
def change_password(request):
    """
    change password
    :param request:
    :return:
    """
    if request.method == "POST":
        new_password = request.POST.get("new_password")
        user = request.user
        user.password = make_password(new_password)
        user.save()
        return render(request, "message.html", {"message": "Пароль успешно изменен"})

    return render(request, "change_password.html")


def log_out(request):
    """
    log out
    :param request:
    :return:
    """
    if request.method == "POST":
        logout(request)
        return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error"}, status=405)


@ratelimit(key='ip', rate='3/h', method='POST', block=False)
def log_in(request):
    """
    log in
    :param request:
    :return:
    """
    if getattr(request, 'limited', False):
        return JsonResponse({"status": "error", "message": "Слишком много запросов. Попробуйте позже."},
                            status=429)
    if request.method == "POST":
        email = request.POST['email']
        if not User.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'нет пользователя с указанным E-mail'}, status=405)
        password = request.POST['password']
        username = User.objects.get(email=email.lower()).username
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"status": "ok"})
        else:
            return JsonResponse({'status': 'error', 'message': 'ошибка ввода пароля'}, status=405)
    else:
        return JsonResponse({"status": "error", 'message': 'ошибка авторизации'}, status=405)
