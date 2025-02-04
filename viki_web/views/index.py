from django.shortcuts import render

from viki_web_cms.models import ProductGroup


def index(request):
    categories = ProductGroup.objects.all()
    context = {'categories': categories}
    return render(request, 'index.html', context)
