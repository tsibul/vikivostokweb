import random

from django.shortcuts import render

from viki_web_cms.models import ProductGroup, Goods, CatalogueItem, ColorGroup, FilterToGoodsGroup, GoodsGroup, \
    PrintType, GoodsDescription, ArticleDescription, CatalogueItemColor, PrintOpportunity, GoodsLayout, GoodsDimensions, \
    Packing


def product(request, product_group_url):
    product_groups = ProductGroup.objects.filter(deleted=False)
    product_group = product_groups.filter(product_group_url=product_group_url).first()
    print_types = PrintType.objects.filter(deleted=False).values(
        'id',
        'name'
    )
    goods = Goods.objects.filter(product_group=product_group, deleted=False, catalogueitem__isnull=False).distinct()
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
    goods_list = []
    for goods_item in goods:
        dimensions = GoodsDimensions.objects.filter(deleted=False, goods=goods_item).first()
        description = GoodsDescription.objects.filter(
            goods=goods_item, deleted=False).first()
        goods_description = description.description if description else ''

        print_data, print_layout = create_print_data(goods_item)
        item_list, id_list, colors = create_item_list(goods_item)
        packing = Packing.objects.filter(deleted=False, goods=goods_item).values(
            'box__name',
            'box__volume',
            'box_weight',
            'quantity_in',
        )

        if len(id_list) > 1:
            id_random = id_list[round(random.random()*(len(id_list)) - 1) ]
        else:
            id_random = id_list[0]
        goods_list.append({
            'goods_item': goods_item,
            'item_list': item_list,
            'item_id': id_list,
            'colors': colors,
            'id_random': id_random,
            'goods_description': goods_description,
            'print_data': print_data,
            'print_layout': print_layout,
            'dimensions': str(dimensions),
            'packing': packing,
        })
    context = {
        'product_groups': product_groups,
        'product_group': product_group,
        'color_group': color_group,
        'filter_option': filter_option,
        'print_types': print_types,
        'goods_list': goods_list,
    }
    if product_group.layout.id == 1:
        return render(request, 'product_hor.html', context)
    else:
        return render(request, 'product_sqr.html', context)


def create_item_list(goods_item):
    items = CatalogueItem.objects.filter(goods=goods_item, deleted=False)
    article_description = ArticleDescription.objects.filter(deleted=False, goods=goods_item)
    item_list = []
    for item in items:
        item_colors = CatalogueItemColor.objects.filter(deleted=False, item=item)
        color_description = ''
        if len(article_description):
            for description in article_description:
                color = item_colors.get(color_position=description.position).color
                color_description += (description.parts_description.name.upper() + ': ' +
                                      color.name + '(' + color.pantone + ') ')
        item_list.append({
            'item': item,
            'color_description': color_description
        })
    colors = items.values(
        'id',
        'main_color__hex'
    )
    id_list = list(items.values_list('id', flat=True))
    return item_list, id_list, colors

def create_print_data(goods_item):
    print_opportunity = PrintOpportunity.objects.filter(deleted=False, goods=goods_item)
    print_data = []
    if len(print_opportunity) > 0:
        for print_opp in print_opportunity:
            print_data.append(
                {
                    'print_type': print_opp.print_data.print_type,
                    'print_place': print_opp.print_data.print_place,
                    'place_quantity': print_opp.print_data.place_quantity,
                    'color_quantity': print_opp.print_data.color_quantity,
                    'dimensions': str(print_opp.print_data.length) + '*' + str(print_opp.print_data.height),
                }
            )
    print_layout = list(GoodsLayout.objects.filter(goods=goods_item, deleted=False))
    return print_data, print_layout
