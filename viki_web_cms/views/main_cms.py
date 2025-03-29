from django.shortcuts import render

from viki_web_cms.classes.customer_menu import CustomerMenu
from viki_web_cms.classes.main_menu import MainMenu


def main_cms(request):
    main_menu = MainMenu.menu_set()
    context = {'menu': main_menu, 'user': request.user.username, 'switch': '/cms/customer'}
    return render(request, 'cms.html', context)


def main_customer(request):
    main_menu = CustomerMenu.menu_set()
    context = {'menu': main_menu, 'user': request.user.username, 'switch': '/cms'}
    return render(request, 'cms.html', context)
