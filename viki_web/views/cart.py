from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Max, Q

from viki_web_cms.models import ProductGroup, PrintOpportunity, Goods, Price, PriceGoodsStandard, PriceItemStandard, PriceGoodsVolume, StandardPriceType, UserExtension, Customer, CatalogueItem, PrintGroupToGoods, PrintPrice, PrintVolume
from viki_web_cms.models.discount_models import VolumeDiscount


def cart(request):
    categories = ProductGroup.objects.filter(deleted=False)
    context = {'categories': categories, 'user': request.user}
    return render(request, 'cart.html', context)


def get_volume_discounts(request):
    """
    Возвращает данные о скидках за объем в формате JSON
    """

    try:
        price_type = get_user_price_type(request)
        # Get all active volume discounts
        volume_discounts = VolumeDiscount.objects.filter(
            deleted=False,
            price_name=price_type
        ).order_by('volume')
        
        result = []
        for discount in volume_discounts:
            discount_data = {
                'id': discount.id,
                'name': discount.name,
                'price_type_id': discount.price_name.id,
                'price_type_name': discount.price_name.name,
                'discount': discount.discount,
                'volume': discount.volume
            }
            result.append(discount_data)
            
        return JsonResponse({'success': True, 'discounts': result})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


def get_print_opportunities(request, goods_id):
    """
    Возвращает JSON с возможностями нанесения для товара по goodsId
    """
    try:
        goods = Goods.objects.get(id=goods_id)
        opportunities = PrintOpportunity.objects.filter(goods=goods, deleted=False)
        
        result = []
        for opportunity in opportunities:
            print_data = opportunity.print_data
            opportunity_data = {
                'id': opportunity.id,
                'print_type_id': print_data.print_type.id,
                'print_type_name': print_data.print_type.name,
                'print_place_id': print_data.print_place.id,
                'print_place_name': print_data.print_place.name,
                'color_quantity': print_data.color_quantity,
                'place_quantity': print_data.place_quantity,
                'length': print_data.length,
                'height': print_data.height
            }
            
            # Добавляем цены для каждой возможности нанесения
            prices = get_print_prices_data(opportunity.id)
            if prices:
                opportunity_data['prices'] = prices
            
            result.append(opportunity_data)
            
        return JsonResponse({'success': True, 'opportunities': result})
    except Goods.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Товар не найден'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


def get_print_prices_data(opportunity_id):
    """
    Возвращает данные о ценах на брендирование для указанной возможности нанесения
    """
    try:
        current_date = timezone.now().date()
        
        # Получаем возможность нанесения
        opportunity = PrintOpportunity.objects.get(id=opportunity_id, deleted=False)
        goods = opportunity.goods
        print_data = opportunity.print_data
        print_type = print_data.print_type
        print_place = print_data.print_place
        
        # Сначала пытаемся найти запись с точным соответствием места печати
        print_group = PrintGroupToGoods.objects.filter(
            goods=goods,
            print_price_group__print_type=print_type,
            print_place=print_place,
            deleted=False
        ).first()
        
        # Если запись с точным соответствием не найдена, ищем запись с пустым полем print_place
        if not print_group:
            print_group = PrintGroupToGoods.objects.filter(
                goods=goods,
                print_price_group__print_type=print_type,
                print_place__isnull=True,
                deleted=False
            ).first()
        
        if not print_group:
            return None
        
        print_price_group = print_group.print_price_group
        
        # Получаем цены для группы нанесения в зависимости от тиража
        print_prices_query = PrintPrice.objects.filter(
            print_price_group=print_price_group,
            deleted=False,
            price_list__price_list_date__lte=current_date
        ).order_by('print_volume__quantity', '-price_list__price_list_date')
        
        # Обрабатываем результаты, чтобы получить уникальные количества с самыми последними ценами
        print_prices_dict = {}
        
        for price in print_prices_query:
            quantity = price.print_volume.quantity
            
            # Оставляем только первую (самую последнюю) цену для каждого количества
            if quantity not in print_prices_dict:
                print_prices_dict[quantity] = {
                    'quantity': quantity,
                    'price': price.price,
                }
        
        # Конвертируем словарь в список
        return list(print_prices_dict.values())
        
    except (PrintOpportunity.DoesNotExist, Exception):
        return None


def get_item_price(request, item_id):
    """
    Получает цену на товар по item_id
    """
    try:
        current_date = timezone.now().date()

        price_type = get_user_price_type(request)

        # Get item and goods
        item = CatalogueItem.objects.get(id=item_id)
        goods = item.goods
        
        # Check if goods has standard price
        if goods.standard_price:
            # First try to find price for item_id
            item_price = PriceItemStandard.objects.filter(
                item_id=item_id,
                price_type=price_type,
                price_list__price_list_date__lte=current_date
            ).filter(
                Q(price_list__promotion_price=False) |
                Q(price_list__promotion_price=True, price_list__promotion_end_date__gt=current_date)
            ).order_by('-price_list__price_list_date').first()
            
            if item_price:
                context = {
                    'success': True,
                    'price': item_price.price,
                    'price_type': price_type.name,
                    'promotion_price': item_price.price_list.promotion_price,
                    'standard_price': True
                }
                return JsonResponse(context)
            
            # If no item price, try to find price for goods_id
            goods_price = PriceGoodsStandard.objects.filter(
                goods=goods,
                price_type=price_type,
                price_list__price_list_date__lte=current_date
            ).filter(
                Q(price_list__promotion_price=False) |
                Q(price_list__promotion_price=True, price_list__promotion_end_date__gt=current_date)
            ).order_by('-price_list__price_list_date').first()
            
            if goods_price:
                context= {
                    'success': True,
                    'price': goods_price.price,
                    'price_type': price_type.name,
                    'promotion_price': goods_price.price_list.promotion_price,
                    'standard_price': True
                }
                return JsonResponse(context)
        else:
            # If not standard price, get all volume prices
            volume_prices_query = PriceGoodsVolume.objects.filter(
                goods=goods,
                price_type=price_type,
                price_list__price_list_date__lte=current_date
            ).filter(
                Q(price_list__promotion_price=False) |
                Q(price_list__promotion_price=True, price_list__promotion_end_date__gt=current_date)
            ).order_by('price_volume__quantity', '-price_list__price_list_date')
            
            # Process data to get distinct quantities with latest price
            volume_prices_dict = {}
            promotion_price = False
            
            for price in volume_prices_query:
                quantity = price.price_volume.quantity
                # Only keep the first (latest) price for each quantity
                if quantity not in volume_prices_dict:
                    volume_prices_dict[quantity] = {
                        'quantity': quantity,
                        'price': price.price
                    }
                    # Store promotion flag from the first price
                    if not promotion_price:
                        promotion_price = price.price_list.promotion_price
            
            # Convert dict to list
            volume_prices = list(volume_prices_dict.values())
            
            if volume_prices:
                context = {
                    'success': True,
                    'prices': volume_prices,
                    'price_type': price_type.name,
                    'promotion_price': promotion_price,
                    'standard_price': False
                }
                return JsonResponse(context)
        
        return JsonResponse({'success': False, 'error': 'Цена не найдена'})
        
    except CatalogueItem.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Товар не найден'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


def get_user_price_type(request):
    # Get user and determine price type
    user = request.user
    price_type = None

    # Try to get user extension
    if user.is_authenticated:
        user_extension = UserExtension.objects.filter(user=user).first()
        if user_extension and user_extension.customer:
            price_type = user_extension.customer.standard_price_type

    # If no price type found, get default (priority 1)
    if not price_type:
        price_type = StandardPriceType.objects.filter(priority=1).first()

    return price_type
