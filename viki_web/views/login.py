import random

from django.core.cache import cache

import string
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password


# Генерация временного пароля
def generate_temp_password(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def send_temp_password(request):
    if request.method == "POST":
        email = request.POST.get("email")

        # Проверяем, существует ли пользователь
        if User.objects.filter(email=email).exists():
            return render(request, "message.html", {"message": "Пользователь уже зарегистрирован!"})

        # Генерируем временный пароль
        temp_password = generate_temp_password()

        # Сохраняем временный пароль в кэше (на 10 минут)
        cache.set(f"temp_pass_{email}", temp_password, timeout=600)

        # Отправляем email
        send_mail(
            "Ваш временный пароль",
            f"Ваш временный пароль: {temp_password}",
            "no-reply@vikyvostok.ru",
            [email],
            fail_silently=False,
        )

        return render(request, "message.html", {"message": "Временный пароль отправлен на вашу почту!"})

    return render(request, "send_password.html")


def login_with_temp_password(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Проверяем временный пароль из кэша
        temp_password = cache.get(f"temp_pass_{email}")
        if temp_password and password == temp_password:
            # Создаем пользователя
            user = User.objects.create_user(username=email, email=email, password=password)
            login(request, user)

            # Удаляем временный пароль из кэша
            cache.delete(f"temp_pass_{email}")

            return redirect("change_password")

        return render(request, "login.html", {"error": "Неверный временный пароль!"})

    return render(request, "login.html")


@login_required
def change_password(request):
    if request.method == "POST":
        new_password = request.POST.get("new_password")
        user = request.user
        user.password = make_password(new_password)
        user.save()
        return render(request, "message.html", {"message": "Пароль успешно изменен"})

    return render(request, "change_password.html")


def log_out(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error"}, status=405)


def log_in(request):
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        username = User.objects.get(email=email.lower()).username
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"status": "ok"})
        else:
            return JsonResponse({"status": "error"}, status=405)
    else:
        return JsonResponse({"status": "error"}, status=405)
