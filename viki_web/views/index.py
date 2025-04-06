from django.shortcuts import render

from viki_web_cms.models import ProductGroup


def index(request):
    categories = ProductGroup.objects.filter(deleted=False)
    context = {'categories': categories, 'user': request.user}
    return render(request, 'index.html', context)
