from django.db.models import Q
from django.shortcuts import render
from transliterate import translit

from viki_web.views import product_context
from viki_web_cms.models import ProductGroup, Goods, GoodsGroup


def catalogue_search(request):
    product_groups = ProductGroup.objects.filter(deleted=False)
    if request.POST.get('search'):
        search_string = request.POST['search']
        goods = Goods.objects.filter(
            (
            Q(name__icontains=search_string) |
            Q(name__icontains=translit(search_string, 'ru')) |
            Q(name__icontains=translit(search_string, 'ru', reversed=True)) |
            Q(goods_group__name__icontains= search_string) |
            Q(goods_group__name__icontains= translit(search_string, 'ru')) |
            Q(goods_group__name__icontains= translit(search_string, 'ru', reversed=True)) |
            Q(product_group__name__icontains=search_string) |
            Q(article__icontains=search_string)
            ) &
            Q(deleted=False) &
            Q(catalogueitem__isnull=False)
        ).distinct()
        product_group = {'name': 'Каталог', 'product_group_url': 'catalogue'}
        context = product_context(request, goods, product_groups, product_group)
        context['search']= search_string
        # context['goods_groups']= goods_groups
        return render(request, 'product_sqr.html', context)
    else:
        goods_groups = GoodsGroup.objects.filter(deleted=False)
        product_group = {'name': 'Каталог', 'product_group_url': 'catalogue'}
        context = {
            'user': request.user,
            'product_groups': product_groups,
            'product_group': product_group,
            'goods_groups': goods_groups,
        }
        return render(request, 'product_sqr.html', context)

def goods_group_page(request, url):
    product_groups = ProductGroup.objects.filter(deleted=False)
    goods_group = GoodsGroup.objects.filter(deleted=False, goods_group_url=url).first()
    goods = Goods.objects.filter(
        deleted=False,
        goods_group=goods_group,
        catalogueitem__isnull=False
    ).distinct()
    product_group = {'name': goods_group.name, 'product_group_url': goods_group.goods_group_url}
    context = product_context(request, goods, product_groups, product_group)
    return render(request, 'product_sqr.html', context)

