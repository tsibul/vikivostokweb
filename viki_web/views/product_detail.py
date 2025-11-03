import json
import random

from django.shortcuts import render, get_object_or_404

from viki_web_cms.models.goods import Goods, GoodsSimilar
from viki_web_cms.models import ProductGroup, CatalogueItemColor, ArticleDescription, CatalogueItem, CatalogueItemPhoto, \
    GoodsRelated

from viki_web.views.product import goods_data, create_print_data, goods_price, create_article_set, find_price_type, \
    item_price


def get_default_seo_for_goods(goods):
    """Генерирует дефолтные SEO-данные для товара без привязанного SEO"""
    
    # Определяем тип товара по группе для SEO
    product_type = ''
    keywords = ''
    if goods.product_group:
        group_name = goods.product_group.name.lower()
        if 'ручк' in group_name:
            product_type = 'ручка с логотипом'
            keywords = 'ручка с логотипом, ручка с нанесением, брендированная ручка'
        elif 'блокнот' in group_name or 'ежедневник' in group_name:
            product_type = 'блокнот с логотипом'
            keywords = 'блокнот с логотипом, блокнот с нанесением, фирменный блокнот'
        elif 'кружк' in group_name or 'стакан' in group_name:
            product_type = 'кружка с логотипом'
            keywords = 'кружка с логотипом, стакан с нанесением, брендированная посуда'
        elif 'монетниц' in group_name or 'pos' in group_name.lower():
            product_type = 'монетница с логотипом'
            keywords = 'монетница с логотипом, POS материалы'
        elif 'брелок' in group_name or 'брелк' in group_name or 'бирк' in group_name:
            product_type = 'брелок с логотипом'
            keywords = 'брелок с логотипом, бирка с нанесением'
        else:
            product_type = 'с логотипом'
            keywords = f'{goods.product_group.name}, сувениры с логотипом'
    
    title = f'{goods.name} {product_type} - купить в Вики Восток'
    description = f'{goods.name} {product_type} на заказ. Качественное нанесение логотипа от производителя Вики Восток.'
    
    if len(description) > 157:
        description = description[:157] + '...'
    
    return {
        'title': title,
        'description': description,
        'keywords': keywords,
        'text': '',
        'og_title': f'{goods.name} {product_type}',
        'og_description': f'{goods.name} {product_type} на заказ',
        'og_image': None,
        'canonical_url': '',
        'noindex': False,
        'nofollow': False,
    }


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
    price, price_volume, promotion_price = goods_price(goods, price_type)

    # Получаем варианты товара, цвета и цены
    item_list, id_list, colors = create_item_list_details(goods, price_type)

    # Получаем набор артикулов
    article_set = create_article_set(goods)

    # Выбираем случайный ID из списка
    id_random = id_list[round(random.random() * (len(id_list)) - 1)] if len(id_list) > 1 else id_list[0]

    # Находим item с id_random с помощью функции next()
    random_item = next((item for item in item_list if item['item'].id == id_random), None)

    similar_goods, related_goods = similar_related_goods(request, goods)

    item_dict = []
    for item_el in item_list:
        item_dict.append(catalogue_item_to_dict(item_el))

    goods_dict = {
        'goods_item': {
            'id': goods.id,
            'name': goods.name,
            'details_number': goods.details_number,
            'article': goods.article,
            'slug': goods.slug,
        },
        'item_list': item_dict,
        'id_random': id_random,
        'random_item': catalogue_item_to_dict(random_item),
        'price': price,
        'price_volume': price_volume,
        'promotion_price': promotion_price,
        'goods_description': goods_description,
        'colors': list(colors),
        'article_set': article_set,
        'multicolor': goods.multicolor
    }

    # Получаем SEO данные
    seo_obj = goods.seo  # ForeignKey, может быть None
    
    # Fallback для текста - берем из группы товаров
    seo_text_fallback = ''
    if product_group.seo and product_group.seo.text:
        seo_text_fallback = product_group.seo.text
    
    if seo_obj:
        # Если есть привязанный SEO объект
        og_image_url = ''
        if seo_obj.og_image:
            og_image_url = request.build_absolute_uri(seo_obj.og_image.url)
        elif random_item:
            og_image_url = request.build_absolute_uri(f'/static/viki_web_cms/files/item_photo/{random_item["item"].image}')
        
        seo_data = {
            'title': seo_obj.title or f'{goods.name} - купить в Вики Восток',
            'description': seo_obj.description or goods.name,
            'keywords': seo_obj.keywords or '',
            'text': seo_obj.text or seo_text_fallback,  # Fallback к тексту группы
            'og_title': seo_obj.og_title or seo_obj.title or goods.name,
            'og_description': seo_obj.og_description or seo_obj.description or goods.name,
            'og_image': og_image_url,
            'url': request.build_absolute_uri(),
            'canonical_url': seo_obj.canonical_url or request.build_absolute_uri(),
            'noindex': seo_obj.noindex,
            'nofollow': seo_obj.nofollow,
        }
    else:
        # Если SEO не привязан - используем дефолтные значения
        default_seo = get_default_seo_for_goods(goods)
        og_image_url = ''
        if random_item:
            og_image_url = request.build_absolute_uri(f'/static/viki_web_cms/files/item_photo/{random_item["item"].image}')
        
        seo_data = {
            **default_seo,
            'text': seo_text_fallback,  # Используем текст из группы
            'og_image': og_image_url,
            'url': request.build_absolute_uri(),
            'canonical_url': request.build_absolute_uri(),
        }

    context = {
        'data': json.dumps(goods_dict),
        'product_group': product_group,
        'product_groups': product_groups,
        'goods': {
            'goods_item': goods,
            'item_list': item_list,
            'id_random': id_random,
            'random_item': random_item,
            'price': price,
            'price_volume': price_volume,
            'promotion_price': promotion_price,
            'goods_description': goods_description,
            'dimensions': str(dimensions),
            'colors': colors,
            'print_data': print_data,
            'print_layout': print_layout,
            'packing': packing,
            'article_set': article_set,
            'multicolor': goods.multicolor
        },
        'similar_goods': similar_goods,
        'related_goods': related_goods,
        'seo': seo_data,
    }
    return render(request, 'product_detail.html', context)


def catalogue_item_to_dict(item_el):
    return {
        'color_description': item_el['color_description'],
        'price': item_el['price'] if 'price' in item_el else None,
        'promotion_price': item_el['promotion_price'] if 'promotion_price' in item_el else False,
        'item': {
            'id': item_el['item'].id,
            'name': item_el['item'].name,
            'item_article': item_el['item'].item_article,
            'image': item_el['item'].image.name,
        }
    }


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
        price, promotion_price = item_price(item, price_type)
        item_list.append({
            'item': item,
            'color_description': color_description,
            'price': price,
            'promotion_price': promotion_price,
            'additional_photo': additional_photo,
        })
    colors = items.values(
        'id',
        'main_color__hex',
        'main_color__name'
    )
    id_list = list(items.values_list('id', flat=True))
    return item_list, id_list, colors


def similar_related_goods(request, goods_item):
    similar = GoodsSimilar.objects.filter(main_goods=goods_item, deleted=False)
    similar_goods = []
    for goods in similar:
        price_type = find_price_type(request)
        price, price_volume, promotion_price = goods_price(goods.similar_goods, price_type)
        catalogue_item = CatalogueItem.objects.filter(goods=goods.similar_goods, deleted=False).order_by('?').first()
        if catalogue_item:
            similar_goods.append({
                'price': price,
                'image': catalogue_item.image,
                'name': goods.similar_goods.name,
                'slug': goods.similar_goods.slug,
                'price_volume': price_volume,
                'promotion_price': promotion_price,
            })
    related = GoodsRelated.objects.filter(main_goods=goods_item, deleted=False)
    related_goods = []
    for goods in related:
        price_type = find_price_type(request)
        price, price_volume, promotion_price = goods_price(goods.related_goods, price_type)
        catalogue_item = CatalogueItem.objects.filter(goods=goods.related_goods, deleted=False).order_by('?').first()
        if catalogue_item:
            related_goods.append({
                'price': price,
                'image': catalogue_item.image,
                'name': goods.related_goods.name,
                'price_volume': price_volume,
                'promotion_price': promotion_price,
                'slug': goods.related_goods.slug})
    return similar_goods, related_goods
