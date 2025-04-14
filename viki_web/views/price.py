from datetime import datetime

from django.db.models import Q, F
from django.shortcuts import render
from transliterate import translit

from viki_web.views import find_price_type
from viki_web_cms.models import ProductGroup, Goods, StandardPriceType, PriceGoodsStandard, CatalogueItem, \
    PriceItemStandard, PriceGoodsQuantity, PriceGoodsVolume, PrintType, PrintVolume, PrintPriceGroup, PrintPrice


def price(request):
    categories = ProductGroup.objects.filter(deleted=False)
    price_type_user = find_price_type(request)
    price_type = [price_type_user]
    current_date = datetime.today().date()
    if not request.POST.get('search'):
        goods_standard = Goods.objects.filter(deleted=False, standard_price=True).order_by('goods_group', 'article')
        goods_volume = Goods.objects.filter(deleted=False, standard_price=False).order_by('goods_group', 'article')
    else:
        goods_standard = Goods.objects.filter(
            Q(deleted=False) &
            Q(standard_price=True) & (
                    Q(name__icontains=request.POST.get('search')) |
                    Q(name__icontains=translit(request.POST.get('search'), 'ru', reversed=True)) |
                    Q(goods_group__name__icontains=request.POST.get('search'))
            )).order_by(
            'goods_group', 'article')
        goods_volume = Goods.objects.filter(
            Q(deleted=False) &
            Q(standard_price=False) & (
                    Q(name__icontains=request.POST.get('search')) |
                    Q(name__icontains=translit(request.POST.get('search'), 'ru', reversed=True)) |
                    Q(goods_group__name__icontains=request.POST.get('search'))
            )).order_by(
            'goods_group', 'article')
    if price_type_user.priority != 1:
        price_type.append(StandardPriceType.objects.filter(deleted=False, priority=1).first())
    standard_prices = []
    for goods in goods_standard:
        price_item = {'article': goods.article, 'goods': goods.name, 'group': goods.goods_group.name}
        prices = []
        for price_typ in price_type:
            standard_price = PriceGoodsStandard.objects.filter(
                Q(goods=goods) &
                Q(price_type=price_typ) &
                (Q(price_list__price_list_date__lte=current_date) &
                 Q(price_list__promotion_price=False) |
                 Q(price_list__promotion_price=True) &
                 Q(price_list__promotion_end_date__gte=current_date)
                 )).order_by('-price_list__price_list_date').first()
            prices.insert(0, standard_price.price)
            # add promotion flag
        price_item['price'] = prices
        standard_prices.append(price_item)
        catalogue_items = CatalogueItem.objects.filter(
            goods=goods,
            deleted=False,
            id__in=PriceItemStandard.objects.values('item')
        )
        if catalogue_items.exists():
            for catalogue_item in catalogue_items:
                price_item = {'article': catalogue_item.item_article, 'goods': catalogue_item.name,
                              'group': goods.goods_group.name}
                prices = []
                for price_typ in price_type:
                    standard_price = PriceItemStandard.objects.filter(
                        Q(item=catalogue_item) &
                        Q(price_type=price_typ) &
                        (Q(price_list__price_list_date__lte=current_date) &
                         Q(price_list__promotion_price=False) |
                         Q(price_list__promotion_price=True) &
                         Q(price_list__promotion_end_date__gte=current_date)
                         )).order_by('-price_list__price_list_date').first()
                    prices.insert(0, standard_price.price)
                    # add promotion flag
                price_item['price'] = prices
                standard_prices.append(price_item)
    goods_quantity = PriceGoodsQuantity.objects.filter(deleted=False).order_by('quantity')
    volume_prices = []
    for quantity in goods_quantity:
        volume_item = {'quantity': quantity.name}
        goods_list = []
        # if len(goods_volume):
        for goods in goods_volume:
            goods_item = {'article': goods.article, 'goods': goods.name, 'group': goods.goods_group.name}
            prices = []
            for price_typ in price_type:
                volume_price = PriceGoodsVolume.objects.filter(
                    Q(goods=goods) &
                    Q(price_type=price_typ) &
                    Q(price_volume=quantity) &
                    (Q(price_list__price_list_date__lte=current_date) &
                     Q(price_list__promotion_price=False) |
                     Q(price_list__promotion_price=True) &
                     Q(price_list__promotion_end_date__gte=current_date)
                     )).order_by('-price_list__price_list_date').first()
                prices.insert(0, volume_price.price)
            goods_item['price'] = prices
            goods_list.append(goods_item)
        volume_item['goods'] = goods_list
        volume_prices.append(volume_item)

    context = {
        'user': request.user,
        'categories': categories,
        'price_length': len(price_type),
        'standard_prices': standard_prices,
        'volume_prices': volume_prices,
        'print_price': print_price(current_date),
    }
    return render(request, 'price.html', context)


def print_price(current_date):
    print_type = list(PrintType.objects.filter(deleted=False).order_by(
        *PrintType.order_default()
    ).annotate(
        print_type__id=F('id'),
    ).values(
        'print_type__id',
        'name',
    ))
    price_data = []
    for type in print_type:
        print_volume = PrintVolume.objects.filter(
            deleted=False, print_type__id=type['print_type__id']
        ).order_by(*PrintVolume.order_default())
        print_volume_length = len(print_volume)
        print_volume_data = list(print_volume.annotate(
            print_volume_id=F('id'),
        ).values(
            'print_volume_id',
            'name',
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
                Q(deleted=False) &
                Q(print_price_group__id=group.id) &
                (Q(price_list__price_list_date__lte=current_date) &
                 Q(price_list__promotion_price=False) |
                 Q(price_list__promotion_price=True) &
                 Q(price_list__promotion_end_date__gte=current_date)
                 )).order_by(*PrintPrice.order_default()).annotate(
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

    return price_data
