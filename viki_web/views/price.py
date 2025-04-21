from datetime import datetime
import csv
from django.db.models import Q, F
from django.shortcuts import render
from django.http import HttpResponse
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
        has_promotion = False
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
            # check if price is from a promotion price list
            if standard_price and standard_price.price_list.promotion_price:
                has_promotion = True
        price_item['price'] = prices
        price_item['promotion'] = has_promotion
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
                has_promotion = False
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
                    if standard_price and standard_price.price_list.promotion_price:
                        has_promotion = True
                price_item['price'] = prices
                price_item['promotion'] = has_promotion
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
            has_promotion = False
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
                if volume_price and volume_price.price_list.promotion_price:
                    has_promotion = True
            goods_item['price'] = prices
            goods_item['promotion'] = has_promotion
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
    print_types_list = list(PrintType.objects.filter(deleted=False).order_by(
        *PrintType.order_default()
    ).annotate(
        print_type__id=F('id'),
    ).values(
        'print_type__id',
        'name',
    ))
    result_data = []
    for print_type_item in print_types_list:
        volumes_queryset = PrintVolume.objects.filter(
            deleted=False, print_type__id=print_type_item['print_type__id']
        ).order_by(*PrintVolume.order_default())
        volumes_count = len(volumes_queryset)
        volumes_data = list(volumes_queryset.annotate(
            print_volume_id=F('id'),
        ).values(
            'print_volume_id',
            'name',
            'quantity'
        )
        )
        type_result = print_type_item.copy()
        type_result['print_volume_length'] = volumes_count
        type_result['print_volume_data'] = volumes_data
        groups_result = []
        groups_queryset = PrintPriceGroup.objects.filter(
            deleted=False,
            print_type__id=print_type_item['print_type__id']
        ).order_by(*PrintPriceGroup.order_default())
        for group_item in groups_queryset:
            group_result = {
                'print_price_group__id': group_item.id,
                'print_price_group__name': group_item.name,
            }
            prices_list = []
            for volume_item in volumes_queryset:
                price_object = PrintPrice.objects.filter(
                    Q(deleted=False) &
                    Q(print_price_group__id=group_item.id) &
                    Q(print_volume=volume_item) &
                    (Q(price_list__price_list_date__lte=current_date) &
                     Q(price_list__promotion_price=False) |
                     Q(price_list__promotion_price=True) &
                     Q(price_list__promotion_end_date__gte=current_date)
                     )).order_by('-price_list__price_list_date').first()
                
                single_price = {
                    'price': price_object.price if price_object else None,
                    'print_volume__id': volume_item.id,
                    'promotion': price_object.price_list.promotion_price if price_object else False
                }
                prices_list.append(single_price)
            
            group_result['prices'] = prices_list
            groups_result.append(group_result)
        type_result['print_groups'] = groups_result
        result_data.append(type_result)

    return result_data


def export_price_csv(request):
    # Get the data we need to export
    price_type_user = find_price_type(request)
    price_type = [price_type_user]
    current_date = datetime.today().date()
    goods_standard = Goods.objects.filter(deleted=False, standard_price=True).order_by('goods_group', 'article')
    goods_volume = Goods.objects.filter(deleted=False, standard_price=False).order_by('goods_group', 'article')
    
    # Create CSV response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="price_list.csv"'
    
    # Create CSV writer with proper settings for Russian locale
    response.write(u'\ufeff')  # BOM for Excel to correctly display Cyrillic
    writer = csv.writer(response, delimiter=';', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    
    # Write standard price header
    if price_type_user.priority != 1:
        price_type.append(StandardPriceType.objects.filter(deleted=False, priority=1).first())
        writer.writerow(['Артикул', 'Группа', 'Название', 'Стандартная цена', 'Ваша цена'])
    else:
        writer.writerow(['Артикул', 'Группа', 'Название', 'Ваша цена'])
    
    # Write standard prices data
    writer.writerow(['Стандартные цены'])
    for goods in goods_standard:
        row_data = [goods.article, goods.goods_group.name, goods.name]
        for price_typ in price_type:
            standard_price = PriceGoodsStandard.objects.filter(
                Q(goods=goods) &
                Q(price_type=price_typ) &
                (Q(price_list__price_list_date__lte=current_date) &
                 Q(price_list__promotion_price=False) |
                 Q(price_list__promotion_price=True) &
                 Q(price_list__promotion_end_date__gte=current_date)
                 )).order_by('-price_list__price_list_date').first()
            # Format price with comma as decimal separator
            formatted_price = str(standard_price.price).replace('.', ',') if standard_price else ''
            row_data.append(formatted_price)
        writer.writerow(row_data)
        
        # Add catalogue items
        catalogue_items = CatalogueItem.objects.filter(
            goods=goods,
            deleted=False,
            id__in=PriceItemStandard.objects.values('item')
        )
        if catalogue_items.exists():
            for catalogue_item in catalogue_items:
                row_data = [catalogue_item.item_article, goods.goods_group.name, catalogue_item.name]
                for price_typ in price_type:
                    standard_price = PriceItemStandard.objects.filter(
                        Q(item=catalogue_item) &
                        Q(price_type=price_typ) &
                        (Q(price_list__price_list_date__lte=current_date) &
                         Q(price_list__promotion_price=False) |
                         Q(price_list__promotion_price=True) &
                         Q(price_list__promotion_end_date__gte=current_date)
                         )).order_by('-price_list__price_list_date').first()
                    formatted_price = str(standard_price.price).replace('.', ',') if standard_price else ''
                    row_data.append(formatted_price)
                writer.writerow(row_data)
    
    # Write volume prices
    writer.writerow([])  # Empty row for separation
    writer.writerow(['Цены от количества'])
    goods_quantity = PriceGoodsQuantity.objects.filter(deleted=False).order_by('quantity')
    
    for quantity in goods_quantity:
        writer.writerow([quantity.name])
        if price_type_user.priority != 1:
            writer.writerow(['Артикул', 'Группа', 'Название', 'Стандартная цена', 'Ваша цена'])
        else:
            writer.writerow(['Артикул', 'Группа', 'Название', 'Ваша цена'])
            
        for goods in goods_volume:
            row_data = [goods.article, goods.goods_group.name, goods.name]
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
                formatted_price = str(volume_price.price).replace('.', ',') if volume_price else ''
                row_data.append(formatted_price)
            writer.writerow(row_data)
    
    # Write print price data
    writer.writerow([])  # Empty row for separation
    writer.writerow(['Брендирование'])
    print_data = print_price(current_date)
    
    for print_type in print_data:
        writer.writerow([print_type['name']])
        header_row = ['Тип печати']
        for volume in print_type['print_volume_data']:
            header_row.append(f"до {volume['quantity']}шт")
        writer.writerow(header_row)
        
        for print_group in print_type['print_groups']:
            row_data = [print_group['print_price_group__name']]
            for price in print_group['prices']:
                formatted_price = str(price['price']).replace('.', ',') if price['price'] else ''
                row_data.append(formatted_price)
            writer.writerow(row_data)
    
    # Add disclaimer
    writer.writerow([])
    writer.writerow(['*Данный прайс-лист не является публичной офертой'])
    
    return response
