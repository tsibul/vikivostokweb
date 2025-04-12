import random

from django.shortcuts import render, get_object_or_404
from viki_web_cms.models.goods import Goods
from viki_web_cms.models import ProductGroup, CatalogueItemColor, ArticleDescription, CatalogueItem, CatalogueItemPhoto

from viki_web.views.product import goods_data, create_print_data, goods_price, create_article_set, find_price_type, \
    item_price


def product_detail(request, product_name):
    product_groups = ProductGroup.objects.filter(deleted=False)

    # Получаем товар и его группу
    goods = get_object_or_404(Goods, slug=product_name)
    product_group = get_object_or_404(ProductGroup, id=goods.product_group_id)

    # Получаем тип цены
    price_type = find_price_type(request)

    # Получаем данные о товаре
    dimensions, goods_description, packing = goods_data(goods)
    print_data, print_layout = create_print_data(goods)
    price = goods_price(goods, price_type)

    # Получаем варианты товара, цвета и цены
    item_list, id_list, colors = create_item_list_details(goods, price_type)

    # Получаем набор артикулов
    article_set = create_article_set(goods)

    # Выбираем случайный ID из списка
    id_random = id_list[round(random.random() * (len(id_list)) - 1)] if len(id_list) > 1 else id_list[0]
    
    # Находим item с id_random с помощью функции next()
    random_item = next((item for item in item_list if item['item'].id == id_random), None)

    context = {
        'categories': product_groups,
        'product_group': product_group,
        'goods': {
            'goods_item': goods,
            'item_list': item_list,
            'id_random': id_random,
            'random_item': random_item,
            'price': price,
            'goods_description': goods_description,
            'dimensions': str(dimensions),
            'colors': colors,
            'print_data': print_data,
            'print_layout': print_layout,
            'packing': packing,
            'article_set': article_set,
            'multicolor': goods.multicolor
        }
    }
    return render(request, 'product_detail.html', context)


def create_item_list_details(goods_item, price_type):
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
            if goods_item.goods_option_group:
                option = item.goods_option.name
                color_description += goods_item.goods_option_group.name.upper() + ': ' + option
        additional_photo = list(CatalogueItemPhoto.objects.filter(item=item, deleted=False).values('add_photo'))
        price = item_price(item, price_type)
        item_list.append({
            'item': item,
            'color_description': color_description,
            'price': price,
            'additional_photo': additional_photo,
        })
    colors = items.values(
        'id',
        'main_color__hex',
        'main_color__name'
    )
    id_list = list(items.values_list('id', flat=True))
    return item_list, id_list, colors