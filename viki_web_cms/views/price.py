import json
from datetime import datetime

from viki_web_cms import models
from django.db.models import F, Q, OuterRef, CharField, Value, Func, Subquery
from django.db.models.functions import Concat, Cast
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.functions.user_validation import user_check
from viki_web_cms.models import Price, StandardPriceType, Goods, PriceGoodsStandard, CatalogueItem, PriceItemStandard, \
    CustomerDiscount, PriceGoodsVolume, PriceGoodsQuantity, PrintPriceGroup, PrintType, PrintVolume, PrintPrice


@csrf_exempt
def save_new_price_date(request):
    """

    :param request:
    :return:
    """
    user_check(request)
    date = datetime.strptime(request.POST['priceDate'], '%Y-%m-%d').date()
    if Price.objects.filter(price_list_date=date).exists():
        return JsonResponse(None, safe=False)
    new_price_date = Price(price_list_date=date)
    if request.POST.get('promoCheck'):
        new_price_date.promotion_price = True
        new_price_date.promotion_end_date = datetime.strptime(request.POST['promoDate'], '%Y-%m-%d').date()
    new_price_date.save()
    option_list = (Price.objects.filter(deleted=False)
                   .annotate(value=F('name'))
                   .values('id', 'value'))
    return JsonResponse(list(option_list), safe=False)


def standard_price_data(request, str_price_date, search_string):
    """

    :param request:
    :param str_price_date:
    :param search_string:
    :return:
    """
    user_check(request)
    price_date = datetime.strptime(str_price_date[0:8], '%d.%m.%y').date()
    price_type_query = CustomerDiscount.objects.filter(deleted=False).order_by(*CustomerDiscount.order_default())
    price_types = list(price_type_query.values(
        'price_name__id',
        'price_name__name',
        'discount'
    ))

    price_subquery = price_goods_subquery(price_date)
    goods = goods_query(search_string, True).annotate(
        price=Subquery(price_subquery, output_field=CharField()),
    ).values(
        'id',
        'article',
        'name',
        'price',
    )

    item_subquery = price_items_subquery(price_date)
    items = item_query(search_string).annotate(
        price=Subquery(item_subquery, output_field=CharField()),
        article=F('item_article'),
    ).values(
        'id',
        'article',
        'goods__id',
        'name',
        'price',
    )

    return JsonResponse({
        'header': price_types,
        'form': {
            'goods': list(goods),
            'items': list(items),
        }
    }, safe=False)


def all_items_all_items_for_dropdown(request):
    """

    :param request:
    :return:
    """
    user_check(request)
    all_items_query = CatalogueItem.objects.filter(
        deleted=False, goods__standard_price=True).order_by(
        *CatalogueItem.order_default())
    all_items = all_items_query.annotate(
        value=Concat(F('item_article'), Value(' '), F('main_color__name')),
    ).values(
        'id',
        'goods__id',
        'value'
    )
    return JsonResponse(list(all_items), safe=False)


def price_goods_subquery(date):
    """

    :param date:
    :return:
    """
    return PriceGoodsStandard.objects.filter(
        goods=OuterRef('id'),
        price_list__price_list_date=date,
    ).order_by(
        'price_type__priority'
    ).annotate(
        price_data=Concat(
            Value('{"id": '),
            # F('id'),
            Cast('id', output_field=CharField()),
            Value(', "price_type__id": '),
            Cast('price_type__id', output_field=CharField()),
            # Value(', "price_type": '),
            # Cast('price_type__name', output_field=CharField()),
            Value(', "price": '),
            Cast('price', output_field=CharField()),
            Value('}')
        )
    ).values(
        'goods'
    ).annotate(
        prices=Concat(
            Value('['), Func(F('price_data'), function='GROUP_CONCAT'), Value(']')
        )
    ).values(
        'prices',
    )


def goods_query(search_string, standard):
    if search_string == 'None':
        goods = Goods.objects.filter(
            deleted=False,
            standard_price=standard,
        ).order_by(*Goods.order_default())
    else:
        search_string = search_string.replace('|', ' ')
        goods = Goods.objects.filter(
            Q(deleted=False) &
            Q(standard_price=standard) & (
                    Q(name__icontains=search_string) |
                    Q(article__icontains=search_string)
            )
        ).order_by(*Goods.order_default())
    return goods


def price_items_subquery(date):
    """

    :param date:
    :return:
    """
    return PriceItemStandard.objects.filter(
        item=OuterRef('id'),
        price_list__price_list_date=date,
    ).order_by(
        'price_type__priority'
    ).annotate(
        price_data=Concat(
            Value('{"id": '),
            Cast('id', output_field=CharField()),
            Value(', "price_type__id": '),
            Cast('price_type__id', output_field=CharField()),
            Value(', "price": '),
            Cast('price', output_field=CharField()),
            Value('}')
        )
    ).values(
        'item'
    ).annotate(
        prices=Concat(
            Value('['), Func(F('price_data'), function='GROUP_CONCAT'), Value(']')
        )
    ).values(
        'prices',
    )


def item_query(search_string):
    """

    :param search_string:
    :return:
    """
    if search_string == 'None':
        items = CatalogueItem.objects.filter(
            deleted=False,
            goods__standard_price=True,
            priceitemstandard__isnull=False
        ).order_by(*CatalogueItem.order_default()).distinct()
    else:
        search_string = search_string.replace('|', ' ')
        items = CatalogueItem.objects.filter(
            Q(deleted=False) &
            Q(goods__standard_price=True) &
            Q(priceitemstandard__isnull=False) &
            (
                    Q(goods__name__icontains=search_string) |
                    Q(goods__article__icontains=search_string) |
                    Q(main_color__name__icontains=search_string)
            )
        ).order_by(*CatalogueItem.order_default()).distinct()
    return items


@csrf_exempt
def delete_item_price_row(request, row_id):
    """

    :param request:
    :param row_id:
    :return:
    """
    user_check(request)
    catalogue_item = CatalogueItem.objects.get(id=row_id)
    item_price = PriceItemStandard.objects.filter(item=catalogue_item)
    if len(item_price):
        for item in item_price:
            item.delete()
    return JsonResponse('Success', safe=False)


def volume_price_data(request, str_price_date, search_string):
    user_check(request)
    price_date = datetime.strptime(str_price_date[0:8], '%d.%m.%y').date()
    price_type_query = CustomerDiscount.objects.filter(deleted=False).order_by(*CustomerDiscount.order_default())
    price_types = list(price_type_query.values(
        'price_name__id',
        'price_name__name',
        'discount'
    ))
    price_subquery = price_goods_volume_subquery(price_date)
    volume_types = PriceGoodsQuantity.objects.filter(deleted=False).order_by(*PriceGoodsQuantity.order_default())
    volumes = list(volume_types.values(
        'id',
        'name',
    ))
    goods = goods_query(search_string, False).annotate(
        price=Subquery(price_subquery, output_field=CharField()),
    ).values(
        'id',
        'article',
        'name',
        'price',
    )
    return JsonResponse({
        'header': price_types,
        'form': {
            'goods': list(goods),
            'volumes': volumes,
        }
    }, safe=False)


def price_goods_volume_subquery(date):
    """

    :param date:
    :return:
    """
    return PriceGoodsVolume.objects.filter(
        goods=OuterRef('id'),
        price_list__price_list_date=date,
    ).order_by(
        'price_volume__quantity',
        'price_type__priority',
    ).annotate(
        price_data=Concat(
            Value('{"id": '),
            Cast('id', output_field=CharField()),
            Value(', "price_type__id": '),
            Cast('price_type__id', output_field=CharField()),
            Value(', "price_volume__id": '),
            Cast('price_volume__id', output_field=CharField()),
            Value(', "price": '),
            Cast('price', output_field=CharField()),
            Value('}')
        )
    ).values(
        'goods'
    ).annotate(
        prices=Concat(
            Value('['), Func(F('price_data'), function='GROUP_CONCAT'), Value(']')
        )
    ).values(
        'prices',
    )


def printing_price_data(request, str_price_date):
    user_check(request)
    price_date = datetime.strptime(str_price_date[0:8], '%d.%m.%y').date()
    print_type = list(PrintType.objects.filter(deleted=False).order_by(
        *PrintType.order_default()
    ).annotate(
        print_type__id=F('id'),
        print_type__name=F('name'),
    ).values(
        'print_type__id',
        'print_type__name',
    ))
    price_data = []
    for type in print_type:
        print_volume = PrintVolume.objects.filter(
            deleted=False, print_type__id=type['print_type__id']
        ).order_by(*PrintVolume.order_default())
        print_volume_length = len(print_volume)
        print_volume_data = list(print_volume.annotate(
            print_volume_id=F('id'),
            print_volume__name=F('name'),
        ).values(
            'print_volume_id',
            'print_volume__name',
            'quantity'
        )
        )
        temp_item = type.copy()
        temp_item['print_volume_length'] = print_volume_length
        temp_item['print_volume_data'] = print_volume_data
        print_groups_list = []
        print_groups = PrintPriceGroup.objects.filter(
            deleted=False,
            print_type__id=type['print_type__id']
        ).order_by(*PrintPriceGroup.order_default())
        for group in print_groups:
            temp_group = {
                'print_price_group__id': group.id,
                'print_price_group__name': group.name,
            }
            prices = list(PrintPrice.objects.filter(
                deleted=False,
                print_price_group__id=group.id,
                price_list__price_list_date=price_date,
            ).order_by(*PrintPrice.order_default()).annotate(
                price__id=F('id'),
            ).values(
                'price__id',
                'price',
                'print_volume__id'
            ))
            temp_group['prices'] = prices
            print_groups_list.append(temp_group)
        temp_item['print_groups'] = print_groups_list
        price_data.append(temp_item)

    return JsonResponse({'priceData': price_data, }, safe=False)


@csrf_exempt
def price_list_save(request):
    """

    :param request:
    :return:
    """
    user_check(request)
    price_data = json.loads(request.body)
    if 'price_goods_quantity__price_volume__id' in price_data['goods'][0].keys():
        price_goods_model = getattr(models, 'PriceGoodsVolume')
    else:
        price_goods_model = getattr(models, 'PriceGoodsStandard')
    goods_list = []
    goods_new_list = []
    for item in price_data['goods']:
        temp_item = prepare_item_kwargs(item)
        goods_keys = [key for key in temp_item.keys() if key != "id"]
        if temp_item['id']:
            goods = price_goods_model.objects.get(id=item['id'])
            for key, value in temp_item.items():
                setattr(goods, key, value)
            if temp_item['price'] is not None and temp_item['price'] != 0:
                goods_list.append(goods)
            else:
                goods.delete()
        elif temp_item['price'] is not None and temp_item['price'] != 0:
            del temp_item['id']
            goods = price_goods_model(**temp_item)
            goods_new_list.append(goods)
    item_list = []
    item_new_list = []
    for item in price_data['item']:
        temp_item = prepare_item_kwargs(item)
        item_keys = [key for key in temp_item.keys() if key != "id"]
        if temp_item['id']:
            item_price = PriceItemStandard.objects.get(id=temp_item['id'])
            for key, value in temp_item.items():
                setattr(item_price, key, value)
            if temp_item['price'] is not None and temp_item['price'] != 0:
                item_list.append(item_price)
            else:
                item_price.delete()
        elif temp_item['price'] is not None and temp_item['price'] != 0:
            del temp_item['id']
            item_price = PriceItemStandard(**temp_item)
            item_new_list.append(item_price)
    if len(goods_list):
        price_goods_model.objects.bulk_update(goods_list, goods_keys)
    if len(item_list):
        PriceItemStandard.objects.bulk_update(item_list, item_keys)
    if len(goods_new_list):
        price_goods_model.objects.bulk_create(goods_new_list)
    if len(item_new_list):
        PriceItemStandard.objects.bulk_create(item_new_list)
    return JsonResponse({'error': False}, safe=False)


def prepare_item_kwargs(item):
    """

    :param item:
    :return:
    """
    temp_item = {}
    for key in item.keys():
        if key.endswith('__id'):
            key_split = key.split('__')
            class_name_received = key_split[0]
            class_name_received.split('_')
            class_name = ''.join([word.capitalize() for word in class_name_received.split('_')])
            field_name = key_split[1]
            key_model = getattr(models, class_name)
            temp_item[field_name] = key_model.objects.get(id=item[key])
        else:
            temp_item[key] = item[key]
    return temp_item
