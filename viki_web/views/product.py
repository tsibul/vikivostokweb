import datetime
import random

from django.db.models import Q
from django.shortcuts import render

from viki_web_cms.models import ProductGroup, Goods, CatalogueItem, ColorGroup, FilterToGoodsGroup, GoodsGroup, \
    PrintType, GoodsDescription, ArticleDescription, CatalogueItemColor, PrintOpportunity, GoodsLayout, GoodsDimensions, \
    Packing, PriceGoodsStandard, StandardPriceType, PriceItemStandard


def product(request, product_group_url):
    product_groups = ProductGroup.objects.filter(deleted=False)
    product_group = product_groups.filter(product_group_url=product_group_url).first()
    goods = Goods.objects.filter(
        product_group=product_group, deleted=False,
        catalogueitem__isnull=False
    ).distinct()
    goods_group = GoodsGroup.objects.filter(deleted=False, goods__in=goods)
    print_types, color_group, filter_option = product_options(goods_group)
    price_type = find_price_type(request)

    goods_list = []
    price_min, price_max = 1000000, 0
    for goods_item in goods:
        dimensions, goods_description, packing = goods_data(goods_item)
        print_data, print_layout = create_print_data(goods_item)
        price = goods_price(goods_item, price_type)
        price_min, price_max = price_min_max(price_min, price_max, price)
        item_list, id_list, colors, price_min, price_max = (
            create_item_list(goods_item, price_type, price_min, price_max))

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
            'price': price,
        })
    context = {
        'product_groups': product_groups,
        'product_group': product_group,
        'color_group': color_group,
        'filter_option': filter_option,
        'print_types': print_types,
        'goods_list': goods_list,
        'price_min': price_min,
        'price_max': price_max,
    }
    if product_group.layout.id == 1:
        return render(request, 'product_hor.html', context)
    else:
        return render(request, 'product_sqr.html', context)

def create_item_list(goods_item, price_type, price_min, price_max):
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
                                      color.name + ' (' + color.pantone + ') ')
        price = item_price(item, price_type)
        price_min, price_max = price_min_max(price_min, price_max, price)
        item_list.append({
            'item': item,
            'color_description': color_description,
            'price': price,
        })
    colors = items.values(
        'id',
        'main_color__hex',
        'main_color__name'
    )
    id_list = list(items.values_list('id', flat=True))
    return item_list, id_list, colors, price_min, price_max

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

def product_options(goods_group):
    print_types = PrintType.objects.filter(deleted=False).values(
        'id',
        'name'
    )
    color_group = ColorGroup.objects.filter(deleted=False).values(
        'id',
        'name',
        'hex'
    )
    filter_option = FilterToGoodsGroup.objects.filter(deleted=False, goods_group__in=goods_group).values(
        'filter_option__name',
        'filter_option__id'
    )
    return print_types, color_group, filter_option

def goods_data (goods_item):
    dimensions = GoodsDimensions.objects.filter(deleted=False, goods=goods_item).first()
    description = GoodsDescription.objects.filter(
        goods=goods_item, deleted=False).first()
    goods_description = description.description if description else ''
    packing = Packing.objects.filter(deleted=False, goods=goods_item).values(
        'box__name',
        'box__volume',
        'box_weight',
        'quantity_in',
    )
    return dimensions, goods_description, packing

def find_price_type(request):
    user_price_type = StandardPriceType.objects.filter(deleted=False).order_by('-priority')
    if request.user.is_authenticated:
        user_group_names = request.user.groups.values_list('name', flat=True)
        price_type = user_price_type.filter(group__name__in=user_group_names).first()
        if not price_type:
            price_type = user_price_type.last()
    else:
        price_type = user_price_type.last()
    return price_type

def goods_price(goods_item, price_type):
    if goods_item.standard_price:
        price_obj = PriceGoodsStandard.objects.filter(
            Q(deleted=False) &
            Q(goods=goods_item) &
            Q(
                Q(price_list__promotion_price=True) &
                Q(price_list__promotion_end_date__gte=datetime.date.today()) |
                Q(price_list__promotion_price=False)
            ) &
            Q(price_type=price_type),
        ).order_by(
            '-price_list__price_list_date'
        ).first()
        price = price_obj.price if price_obj else 'по запросу'
    else:
        price = 'по запросу'
    return price

def item_price(item, price_type):
    price_obj = PriceItemStandard.objects.filter(
        Q(deleted=False) &
        Q(item=item) &
        Q(
            Q(price_list__promotion_price=True) &
            Q(price_list__promotion_end_date__gte=datetime.date.today()) |
            Q(price_list__promotion_price=False)
        ) &
        Q(price_type=price_type),
    ).order_by(
        '-price_list__price_list_date'
    ).first()
    price = price_obj.price if price_obj else None
    return price

def price_min_max(price_min, price_max, price):
    if not isinstance(price, str) and price is not None:
        if price < price_min:
            price_min = price
        if price > price_max:
            price_max = price
    return price_min, price_max

