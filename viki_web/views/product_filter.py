import json
import random

from django.db.models import Q, CharField
from django.db.models.functions import Cast
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.models import ProductGroup, Goods, FilterToGoods, PrintOpportunity, GoodsGroup, CatalogueItem, \
    ArticleDescription, CatalogueItemColor


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


def goods_filter_request(goods_id_list, id_list):
    return list(
        Goods.objects.filter(
            Q(id__in=goods_id_list) &
            Q(id__in=id_list)
        ).annotate(id_str=Cast('id', CharField())).values_list('id_str', flat=True)
    )


def filter_color(goods_id_list, color_id_list):
    return JsonResponse({}, safe=False)

# @csrf_exempt
# def product_filter(request, product_group_url):
#     product_groups = ProductGroup.objects.filter(deleted=False)
#     product_group = product_groups.filter(product_group_url=product_group_url).first()
#     request_data = json.loads(request.body)
#     goods_filter_req = request_data['filter']
#     goods_filtered = list(FilterToGoods.objects.filter(
#         deleted=False,
#         filter_option_id__in=goods_filter_req
#     ).distinct().values_list('goods_id', flat=True))
#     print_type_req = request_data['print_type']
#     print_filtered = list(PrintOpportunity.objects.filter(
#         deleted=False,
#         print_data__print_type__id__in=print_type_req
#     ).distinct().values_list('goods__id', flat=True))
#     color_req = request_data['color']
#     price_limit = float(request_data['price'])
#     goods = Goods.objects.filter(
#         product_group=product_group,
#         deleted=False,
#         catalogueitem__isnull=False,
#     ).distinct()
#     if len(goods_filtered + print_filtered):
#         goods = goods.filter(
#             id__in=(goods_filtered + print_filtered),
#         ).distinct()
#     goods_group = GoodsGroup.objects.filter(deleted=False, goods__in=goods)
#     print_types, color_group, filter_option = product_options(goods_group)
#     price_type = find_price_type(request)
#
#     goods_list = []
#     price_min, price_max = 1000000, 0
#     for goods_item in goods:
#         dimensions, goods_description, packing = goods_data(goods_item)
#         print_data, print_layout = create_print_data(goods_item)
#         price = goods_price(goods_item, price_type)
#         price_min, price_max = price_min_max(price_min, price_max, price)
#
#         item_list, id_list, colors, price_min, price_max = (
#             create_item_list_filter(goods_item, price_type, price_min, price_max, color_req, price_limit))
#
#         if len(id_list) > 1:
#             id_random = id_list[round(random.random() * (len(id_list)) - 1)]
#         else:
#             id_random = id_list[0]
#         if price != 'по запросу' and price <= price_limit + 0.1 or any(item.get("price", None) is not None for item in item_list):
#             goods_list.append({
#                 'goods_item': goods_item,
#                 'item_list': item_list,
#                 'item_id': id_list,
#                 'colors': colors,
#                 'id_random': id_random,
#                 'goods_description': goods_description,
#                 'print_data': print_data,
#                 'print_layout': print_layout,
#                 'dimensions': str(dimensions),
#                 'packing': packing,
#                 'price': price,
#             })
#     context = {
#         'product_groups': product_groups,
#         'product_group': product_group,
#         'color_group': color_group,
#         'filter_option': filter_option,
#         'print_types': print_types,
#         'goods_list': goods_list,
#         'price_min': price_min,
#         'price_max': price_max,
#     }
#     if product_group.layout.id == 1:
#         return render(request, 'product_hor.html', context)
#     else:
#         return render(request, 'product_sqr.html', context)
#
#
# def create_item_list_filter(goods_item, price_type, price_min, price_max, color_req, price_limit):
#     color_filter = CatalogueItemColor.objects.filter(
#         deleted=False,
#         color__id__in=color_req,
#     ).values_list('item__id', flat=True).distinct()
#     items = CatalogueItem.objects.filter(
#         goods=goods_item,
#         deleted=False)
#     if len(color_req):
#         items = items.filter(id__in=color_filter).distinct()
#     article_description = ArticleDescription.objects.filter(deleted=False, goods=goods_item)
#     item_list = []
#     for item in items:
#         item_colors = CatalogueItemColor.objects.filter(
#             deleted=False,
#             item=item,
#         )
#         color_description = ''
#         if len(article_description):
#             for description in article_description:
#                 color = item_colors.get(color_position=description.position).color
#                 color_description += (description.parts_description.name.upper() + ': ' +
#                                       color.name + '(' + color.pantone + ') ')
#         price = item_price(item, price_type)
#         price_min, price_max = price_min_max(price_min, price_max, price)
#         if not price or price <= price_limit + 0.1 :
#             item_list.append({
#                 'item': item,
#                 'color_description': color_description,
#                 'price': price,
#             })
#     colors = items.values(
#         'id',
#         'main_color__hex'
#     )
#     id_list = list(items.values_list('id', flat=True))
#     return item_list, id_list, colors, price_min, price_max
