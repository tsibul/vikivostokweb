from django.shortcuts import render

from viki_web_cms.models import ProductGroup, Goods, CatalogueItem, ColorGroup, FilterToGoodsGroup, GoodsGroup, \
    PrintType


def product(request, product_group_url):
    product_groups = ProductGroup.objects.filter(deleted=False)
    product_group = product_groups.filter(product_group_url=product_group_url).first()
    print_types = PrintType.objects.filter(deleted=False).values(
        'id',
        'name'
    )
    goods = Goods.objects.filter(product_group=product_group, deleted=False)
    goods_group = GoodsGroup.objects.filter(deleted=False, goods__in=goods)
    color_group = ColorGroup.objects.filter(deleted=False). values(
        'id',
        'name',
        'hex'
    )
    filter_option = FilterToGoodsGroup.objects.filter(deleted=False, goods_group__in=goods_group).values(
        'filter_option__name',
        'filter_option__id'
    )
    items = CatalogueItem.objects.filter(goods__in=goods, deleted=False)
    context = {
        'product_groups': product_groups,
        'product_group': product_group,
        'color_group': color_group,
        'filter_option': filter_option,
        'print_types': print_types,
    }
    if product_group.layout.id == 1:
        return render(request, 'product_hor.html', context)
    else:
        return render(request, 'product_sqr.html', context)
