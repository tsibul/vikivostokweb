import json

from django.db.models import Q, CharField
from django.db.models.functions import Cast
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.models import Goods, FilterToGoods, PrintOpportunity, ColorGroup, CatalogueItemColor


@csrf_exempt
def product_filter(request, product_group_url, filter_type):
    request_data = json.loads(request.body)
    goods_id_list = request_data.get('goods_id')
    filter_id_list = request_data.get('filter_id')
    match filter_type:
        case 'filter':
            return filter_filter(goods_id_list, filter_id_list)
        case 'print':
            return filter_print(goods_id_list, filter_id_list)
        case 'color':
            return filter_color(goods_id_list, filter_id_list)


def filter_filter(goods_id_list, filter_id_list):
    goods_filter = FilterToGoods.objects.filter(
        filter_option__id__in=filter_id_list,
        deleted=False
    ).values_list('goods__id', flat=True)
    goods = goods_filter_request(goods_id_list, goods_filter)
    return JsonResponse({'idList': goods}, safe=False)


def filter_print(goods_id_list, print_id_list):
    print_filter = PrintOpportunity.objects.filter(
        print_data__print_type__id__in=print_id_list,
        deleted=False
    ).values_list('goods__id', flat=True)
    goods = goods_filter_request(goods_id_list, print_filter)
    return JsonResponse({'idList': goods}, safe=False)


def filter_color(items_id_list, color_id_list):
    color_filter = ColorGroup.objects.filter(
        deleted=False,
        id__in=color_id_list)
    item_id = CatalogueItemColor.objects.filter(
        deleted=False,
        color__color_group__id__in=color_filter,
        item__id__in=items_id_list
    ).distinct()
    item_id_list = item_id.annotate(
        item_id_str=Cast('item__id', CharField()),
    ).values_list(
        'item_id_str', flat=True
    )
    goods_id_list = item_id.annotate(
        goods_id=Cast('item__goods__id', CharField())).values_list(
        'goods_id', flat=True).distinct()
    return JsonResponse(
        {'idList': {
            'goods': list(goods_id_list),
            'item': list(item_id_list),
        }}, safe=False)


def goods_filter_request(goods_id_list, id_list):
    return list(
        Goods.objects.filter(
            Q(id__in=goods_id_list) &
            Q(id__in=id_list)
        ).annotate(id_str=Cast('id', CharField())).values_list('id_str', flat=True)
    )