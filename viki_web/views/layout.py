from django.shortcuts import render

from viki_web_cms.models import GoodsLayout, ProductGroup


def layout(request):
    categories = ProductGroup.objects.filter(deleted=False)
    if not request.POST.get('search'):
        layouts = (GoodsLayout.objects.filter(deleted=False))
    else:
        search = request.POST.get('search')
        layouts = GoodsLayout.objects.filter(deleted=False, name__icontains=search)
    context = {'user': request.user, 'layouts': list(layouts), 'categories': categories}
    return render(request, 'layouts.html', context)
