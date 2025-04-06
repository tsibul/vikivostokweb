import random
from django.shortcuts import render, get_object_or_404
from viki_web_cms.models.goods import Goods, GoodsOption, GoodsGroup
from viki_web_cms.models.item_models import CatalogueItem, CatalogueItemColor
from viki_web_cms.models.color_models import Color, ColorScheme
from viki_web_cms.models import ProductGroup, PrintData, Packing, PrintLayout
from django.http import Http404
from viki_web.views.product import goods_data, create_print_data, goods_price, create_item_list, create_article_set, find_price_type


def product_detail(request, product_name):
    product_groups = ProductGroup.objects.filter(deleted=False)

    # Получаем ID товара из GET-параметра
    goods_id = request.GET.get('id')
    if not goods_id:
        raise Http404("Товар не найден")
    
    # Получаем товар и его группу
    goods = get_object_or_404(Goods, id=goods_id)
    product_group = get_object_or_404(ProductGroup, id=goods.product_group_id)
    
    # Получаем тип цены
    price_type = find_price_type(request)
    
    # Получаем данные о товаре
    dimensions, goods_description, packing = goods_data(goods)
    print_data, print_layout = create_print_data(goods)
    price = goods_price(goods, price_type)
    
    # Получаем варианты товара, цвета и цены
    item_list, id_list, colors, price_min, price_max = create_item_list(goods, price_type, 1000000, 0)
    
    # Получаем набор артикулов
    article_set = create_article_set(goods)
    
    # Выбираем случайный ID из списка
    id_random = id_list[round(random.random() * (len(id_list)) - 1)] if len(id_list) > 1 else id_list[0]
    
    context = {
        'categories': product_groups,
        'product_group': product_group,
        'goods': {
            'goods_item': goods,
            'item_list': item_list,
            'id_random': id_random,
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
