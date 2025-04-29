"""
Quote management module for commercial proposals
"""

from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
from django.shortcuts import render
from viki_web_cms.models.description import GoodsDescription
from viki_web_cms.models import Goods
import json

def quote_view(request):
    """
    Render the quote page with cart data from POST request
    """
    cart_items = []
    
    # Если запрос POST, получаем данные корзины
    if request.method == 'POST':
        try:
            # Пробуем получить данные из тела запроса для fetch API
            data = json.loads(request.body.decode('utf-8'))
            cart_items = data
            print(f"Получены данные из тела запроса: {len(cart_items)} элементов")
        except (json.JSONDecodeError, AttributeError, UnicodeDecodeError) as e:
            # Если не получилось, ищем в POST параметрах
            cart_data = request.POST.get('cart_data')
            try:
                cart_items = json.loads(cart_data)
            except json.JSONDecodeError as e:
                print(f"Ошибка декодирования JSON из POST: {e}")
                cart_items = []
    else:
        print("Получен GET запрос, данные корзины не ожидаются")
    
    # Проверка, что cart_items - это список
    # if not isinstance(cart_items, list):
    #     cart_items = []
    
    # Получение описаний для товаров
    for item in cart_items:
        if isinstance(item, dict) and 'id' in item:
            item['db_description'] = get_goods_description(item.get('goodsId'))
            if item['branding']:
                for branding in item['branding']:
                    second_pass_mult = 1.3 if branding['secondPass'] else 1
                    branding['price'] = branding['price'] * branding['colors'] * second_pass_mult

    context = {
        'title': 'Коммерческое предложение',
        'cart_items': cart_items,
        'total_items': len(cart_items),
        'total_sum': sum(item.get('price', 0) * item.get('quantity', 0) for item in cart_items if isinstance(item, dict))
    }
    return render(request, 'quote.html', context)

def get_goods_description(goods_id):
    """
    Get description for goods from database
    """
    try:
        description = GoodsDescription.objects.filter(goods_id=goods_id, deleted=False).first()
        if description:
            return description.description
        return ""
    except Exception as e:
        print(f"Error getting goods description: {e}")
        return ""

def generate_quote_pdf(request):
    """
    Generate PDF from quote data
    This is a placeholder for future PDF generation functionality
    """
    # In the future, this will use a PDF generation library
    # For now, just return a simple page
    cart_data = json.loads(request.POST.get('cart_data', '[]'))
    
    context = {
        'cart_data': cart_data,
    }
    
    return HttpResponse("<h1>PDF Generated</h1>")

def get_goods_info(request):
    """
    Get additional goods information for the quote
    """
    goods_id = request.GET.get('goods_id')
    if not goods_id:
        return JsonResponse({'error': 'No goods_id provided'}, status=400)
        
    try:
        goods = Goods.objects.get(id=goods_id)
        description = get_goods_description(goods_id)
        
        return JsonResponse({
            'success': True,
            'description': description,
        })
    except Goods.DoesNotExist:
        return JsonResponse({'error': 'Goods not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500) 