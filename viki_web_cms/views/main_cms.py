from django.shortcuts import render

from viki_web_cms.classes.main_menu import MainMenu

def main_cms(request):
    main_menu = MainMenu.menu_set()
    context = {'menu': main_menu, 'user': request.user.username}
    return render(request, 'cms.html', context)
