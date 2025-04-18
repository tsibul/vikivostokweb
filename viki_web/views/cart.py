from django.shortcuts import render
from django.http import JsonResponse

from viki_web_cms.models import ProductGroup, PrintOpportunity, Goods


def cart(request):
    categories = ProductGroup.objects.filter(deleted=False)
    context = {'categories': categories, 'user': request.user}
    return render(request, 'cart.html', context)


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
            result.append({
                'id': opportunity.id,
                'print_type_id': print_data.print_type.id,
                'print_type_name': print_data.print_type.name,
                'print_place_id': print_data.print_place.id,
                'print_place_name': print_data.print_place.name,
                'color_quantity': print_data.color_quantity,
                'place_quantity': print_data.place_quantity,
                'length': print_data.length,
                'height': print_data.height
            })
            
        return JsonResponse({'success': True, 'opportunities': result})
    except Goods.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Товар не найден'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
