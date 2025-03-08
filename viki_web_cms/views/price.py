from datetime import datetime

from django.db.models import F, Q, OuterRef, CharField, Value, Func, Subquery
from django.db.models.functions import Concat, Cast
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.models import Price, StandardPriceType, Goods, PriceGoodsStandard, CatalogueItem, PriceItemStandard, \
    CustomerDiscount


@csrf_exempt
def save_new_price_date(request):
    """

    :param request:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    date = datetime.strptime(request.POST['priceDate'], '%Y-%m-%d').date()
    if Price.objects.filter(date=date).exists():
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
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    price_date = datetime.strptime(str_price_date[0:8], '%d.%m.%y').date()
    price_type_query = CustomerDiscount.objects.filter(deleted=False).order_by(*CustomerDiscount.order_default())
    price_types = list(price_type_query.values(
        'price_name__id',
        'price_name__name',
        'discount'
    ))


    price_subquery = price_goods_subquery(price_date)
    goods = goods_query(search_string).annotate(
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
        'item_article',
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
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
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
            Value(', "price_type": '),
            Cast('price_type__name', output_field=CharField()),
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


def goods_query(search_string):
    if search_string == 'None':
        goods = Goods.objects.filter(
            deleted=False,
            standard_price=True
        ).order_by(*Goods.order_default())
    else:
        search_string = search_string.replace('|', ' ')
        goods = Goods.objects.filter(
            Q(deleted=False) &
            Q(standard_price=True) & (
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
            # F('id'),
            Cast('id', output_field=CharField()),
            Value(', "price_type__id": '),
            Cast('price_type__id', output_field=CharField()),
            Value(', "price_type": '),
            Cast('price_type__name', output_field=CharField()),
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
        ).order_by(*CatalogueItem.order_default())
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
        ).order_by(*CatalogueItem.order_default())
    return items

@csrf_exempt
def delete_item_price_row(request, row_id):
    """

    :param request:
    :param row_id:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    catalogue_item = CatalogueItem.objects.get(id=row_id)
    item_price = PriceItemStandard.objects.filter(item=catalogue_item)
    if len(item_price):
        for item in item_price:
            item.delete()
    return JsonResponse('Success', safe=False)

def volume_price_data(request, str_price_date, search_string):
    return JsonResponse({}, safe=False)

def printing_price_data(request, str_price_date, search_string):
    return JsonResponse({}, safe=False)
