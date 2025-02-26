from django.db.models import Q, F, Value, Subquery, OuterRef, CharField
from django.db.models.functions import Concat, Cast
from django.http import JsonResponse

from viki_web_cms.models import (CatalogueItem, Goods, GoodsToOption,
                                 Color, CatalogueItemOption, CatalogueItemColor)


def catalogue_data(request, deleted, first_record, search_string, order):
    """

    :param request:
    :param deleted:
    :param first_record:
    :param search_string:
    :param order:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    if order == '0':
        order = CatalogueItem.order_default()
    if not search_string:
        if not deleted:
            items = CatalogueItem.objects.filter(deleted=False).order_by(*order)[first_record: first_record + 20]
        else:
            items = CatalogueItem.objects.all().order_by(*order)[first_record: first_record + 20]
    else:
        search_string = search_string.replace('|', ' ')
        if not deleted:
            items = CatalogueItem.objects.filter(
                Q(deleted=False) & (
                        Q(name__icontains=search_string) |
                        Q(goods__name__icontains=search_string) |
                        Q(item_article__icontains=search_string) |
                        Q(main_color__name=search_string) |
                        Q(main_color__code__icontains=search_string) |
                        Q(image__icontains=search_string)
                )
            ).order_by(*order)[first_record: first_record + 20]
        else:
            items = CatalogueItem.objects.filter(
                Q(name__icontains=search_string) |
                Q(goods__name__icontains=search_string) |
                Q(item_article__icontains=search_string) |
                Q(main_color__name=search_string) |
                Q(main_color__code__icontains=search_string) |
                Q(image__icontains=search_string)
            ).order_by(*order)[first_record: first_record + 20]
    values = catalogue_value_query(items)
    return JsonResponse({
        'values': values,
    }, safe=False)


def parse_file_data(request, goods_id, simple_article, file_name):
    """

    :param request:
    :param goods_id:
    :param simple_article:
    :param file_name:
    :return:
    """
    image_name = file_name.split('.')[0]
    goods = Goods.objects.get(id=goods_id)
    goods_article = goods.article
    name = goods.name
    if not image_name.startswith(goods_article):
        return JsonResponse( {'error': True}, safe=False)
    option_length = 1 if GoodsToOption.objects.filter(goods=goods).exists() else 0
    if simple_article:
        color_article_str = image_name.removeprefix(goods_article)
        if not (
                len(image_name) - len(goods_article) == len(color_article_str) or
                len(color_article_str) == goods.details_number * 2 + option_length
        ):
            return JsonResponse({'error': True}, safe=False)
        color_article = [color_article_str[i:i + 2] for i in range(0, len(color_article_str) - option_length, 2)]
        if option_length:
            color_article.append(color_article_str[-1:])
    else:
        color_article = image_name.split('#')[1:]
        if not (
                image_name.split('#')[0] == goods_article and
                len(color_article) == goods.details_number + option_length
        ):
            return JsonResponse({'error': True}, safe=False)
    main_color = Color.objects.filter(color_scheme=goods.color_scheme, code=color_article[0]).first()
    name = name + ' ' + main_color.name
    item_article = goods_article + '.' + '.'.join(color_article)
    colors_to_save = []
    if goods.multicolor:
        for i in range(1, goods.details_number):
            if (goods.additional_material and i < goods.details_number - 1) or not goods.additional_material:
                current_color = Color.objects.filter(color_scheme=goods.color_scheme,
                                                     code=color_article[i]).first()
            else:
                current_color = Color.objects.filter(color_scheme=goods.additional_color_scheme,
                                                     code=color_article[i]).first()
            if not current_color:
                return JsonResponse({'error': True}, safe=False)
            name = name + '/' + current_color.name
            colors_to_save.append({
                'color__id': current_color.id,
                'color_position': i + 1,
            })
    elif  goods.additional_material:
        current_color = Color.objects.filter(color_scheme=goods.additional_color_scheme,
                                             code=color_article[-1]).first()
        if not current_color:
            return JsonResponse({'error': True}, safe=False)
        colors_to_save.append({
            'color__id': current_color.id,
            'color_position': goods.details_number,
        })
        name = name + '/' + current_color.name
    new_option = None
    if option_length:
        item_option = (GoodsToOption.objects.filter(goods=goods)
                       .values(
            'goods_options__id',
            'goods_options__name',
            'goods_options__option_article',
        ))
        new_option = next((option for option in item_option if option['goods_options__option_article'] == color_article[-1]), None)
        if new_option:
            name = name + '/' + new_option['goods_options__option_name']
    item_values = {
        'name': name,
        'item_article': item_article,
        'main_color__id': main_color.id,
        'main_color_text': main_color.code + ' ' + main_color.name,
        'option': new_option.goods_options__id if new_option else None,
        'colors': colors_to_save if colors_to_save else None,
    }
    return JsonResponse({
        'values': item_values,
        'error': False,
    }, safe=False)


def catalogue_record(request, record_id):
    """
    return single catalogue record with option & additional colors by id
    :param request:
    :param record_id:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    item = CatalogueItem.objects.filter(id=record_id)
    values = catalogue_value_query(item)
    return JsonResponse({
        'values': values,
    }, safe=False)

def save_catalogue_item(request, record_id):
    return JsonResponse({'id': record_id}, safe=False)


def catalogue_value_query(items):
    """
    prepare json serialize data for catalogye record
    :param items:
    :return:
    """
    colors_subquery = (CatalogueItemColor.objects.filter(
        item=OuterRef('id')
    ).annotate(
        colors=Concat(
            Value('"color__id":'),
            Cast(F('color__id'), output_field=CharField()),
            Value('"color_position":'),
            Cast(F('color_position'), output_field=CharField()),
        )
    )
    .values(
        'colors',
    ))
    option_subquery = CatalogueItemOption.objects.filter(
        item__id=OuterRef('id')
    ).values('option__id')[:1]

    values = list(items.annotate(
            goods_text=Concat(F('goods__article'), Value(' '), F('goods__name')),
            main_color_text=Concat(F('main_color__code'), Value(' '), F('main_color__name')),
            option=Subquery(option_subquery, output_field=CharField()),
            colors=Subquery(colors_subquery, output_field=CharField()),
        ).values(
            'name',
            'deleted',
            'item_article',
            'goods__id',
            'goods_text',
            'main_color__id',
            'main_color_text',
            'image',
            'option',
            'colors',
        ))
    return values
