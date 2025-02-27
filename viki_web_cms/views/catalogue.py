import json

from django.db.models import Q, F, Value, Subquery, OuterRef, CharField
from django.db.models.functions import Concat, Cast
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.models import CatalogueItem, Goods, Color, CatalogueItemColor, GoodsOption


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
                        Q(image__icontains=search_string) |
                        Q(goods_option__name__icontains=search_string)
                )
            ).order_by(*order)[first_record: first_record + 20]
        else:
            items = CatalogueItem.objects.filter(
                Q(name__icontains=search_string) |
                Q(goods__name__icontains=search_string) |
                Q(item_article__icontains=search_string) |
                Q(main_color__name=search_string) |
                Q(main_color__code__icontains=search_string) |
                Q(image__icontains=search_string) |
                Q(goods_option__name__icontains=search_string)
            ).order_by(*order)[first_record: first_record + 20]
    values = catalogue_value_query(items)
    return JsonResponse({
        'values': values,
    }, safe=False)


def parse_file_data(request, goods_id, simple_article, file_name, item_id):
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
        return JsonResponse({'error': True}, safe=False)
    option_length = 1 if goods.goods_option_group else 0
    if simple_article:
        color_article_str = image_name[len(goods_article):]
        color_article = [color_article_str[i:i + 2] for i in range(0, len(color_article_str) - option_length, 2)]
        if option_length:
            color_article.append(color_article_str[-1:])
    else:
        color_article = image_name.split('#')[1:]
    if not len(color_article) == goods.details_number + option_length:
        return JsonResponse({'error': True}, safe=False)
    item_article = goods_article + '.' + '.'.join(color_article)
    double_item = CatalogueItem.objects.filter(
        item_article=item_article,
        deleted=False)
    if double_item.count() > 1 or (double_item.count() == 1 and double_item.first().id != item_id):
        return JsonResponse({'error': True}, safe=False)
    colors_to_save = []
    temp_color_id = -1
    for i in range(0, goods.details_number):
        if (goods.additional_material and i < goods.details_number - 1) or not goods.additional_material:
            current_color = Color.objects.filter(
                color_scheme=goods.color_scheme,
                code=color_article[i],
                deleted=False).first()
            if not goods.multicolor and i and current_color.id != temp_color_id:
                return JsonResponse({'error': True}, safe=False)
            temp_color_id = current_color.id
        else:
            current_color = Color.objects.filter(
                color_scheme=goods.additional_color_scheme,
                code=color_article[i],
                deleted=False).first()
        if not current_color:
            return JsonResponse({'error': True}, safe=False)
        if goods.multicolor or i == 0:
            name = name + '/' + current_color.name
        colors_to_save.append({
            'color__id': current_color.id,
            'color_position': i + 1,
            'color_text': current_color.code + ' ' + current_color.name,
        })
    if option_length:
        new_option = GoodsOption.objects.filter(
            option_group=goods.goods_option_group,
            option_article=color_article[-1],
            deleted=False).first()
        if new_option:
            name = name + '/' + new_option.name
        else:
            return JsonResponse({'error': True}, safe=False)
    item_values = {
        'name': name,
        'item_article': item_article,
        'main_color__id': colors_to_save[0]['color__id'],
        'main_color_text': colors_to_save[0]['color_text'],
        'option__id': new_option.id if new_option else None,
        'option__name': new_option.name if new_option else None,
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


@csrf_exempt
def save_catalogue_item(request, record_id):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    colors = json.loads(request.POST.get('colors'))
    option_id = request.POST.get('option')
    if option_id:
        option_object = GoodsOption.objects.get(id=option_id)
    if record_id:
        item = CatalogueItem.objects.get(id=record_id)
    else:
        item = CatalogueItem(id=record_id)
    item.name = request.POST['name']
    item.item_article = request.POST['item_article']
    item.main_color__id = int(request.POST['main_color__id'])
    item.goods__id = int(request.POST['goods__id'])
    item.deleted = item.deleted = True if request.POST.get('deleted') else False
    item.simple_article = True if request.POST.get('simple_article') else False

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

    values = list(items.annotate(
        goods_text=Concat(F('goods__article'), Value(' '), F('goods__name')),
        main_color_text=Concat(F('main_color__code'), Value(' '), F('main_color__name')),
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
        'option__id',
        'option__name',
        'colors',
    ))
    return values
