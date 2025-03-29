from django.shortcuts import render

from viki_web_customer.classes.main_menu import CustomerMenu

def main_customer(request):
    main_menu = CustomerMenu.menu_set()
    context = {'menu': main_menu, 'user': request.user.username}
    return render(request, 'customer.html', context)
