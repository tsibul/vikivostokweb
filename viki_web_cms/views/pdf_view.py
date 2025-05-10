from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from viki_web_cms.models import Order, OrderMailLog
from viki_web_cms.models.our_company_models import OurBank
from viki_web_cms.functions.order_pdf_generator import generate_invoice_number, get_branding_approved_date
from num2words import num2words

import locale
locale.setlocale(locale.LC_ALL, '')

def format_money(val):
    return locale.format_string('%.2f', val, grouping=True).replace(',', '.')

def format_quantity(val):
    return locale.format_string('%d', val, grouping=True)

def debug_order_pdf(request, order_id):
    """Временный эндпоинт для просмотра HTML заказа"""
    order = Order.objects.get(pk=order_id)
    items = order.orderitem_set.all()
    branding_items = items.filter(orderitembranding__isnull=False)
    
    return render(request, 'pdf/order_pdf.html', {
        'order': order,
        'items': items,
        'branding_items': branding_items
    })

def debug_invoice_pdf(request, order_id):
    """Временный эндпоинт для просмотра HTML счета"""
    order = Order.objects.get(pk=order_id)
    items = order.orderitem_set.all()
    
    # Вычисляем НДС (сумма/6)
    vat_amount = order.total_amount / 6
    
    items_count = items.count()

    # Получаем банк с минимальным priority
    our_bank = OurBank.objects.filter(our_company=order.our_company).order_by('priority').first()

    # Форматируем суммы и даты
    for item in items:
        item.price_str = format_money(item.price)
        item.total_price_str = format_money(item.total_price)
        item.quantity_str = format_quantity(item.quantity)
        # Кэшируем брендирование в самом item
        item.brandings = list(item.orderitembranding_set.all())
        for branding in item.brandings:
            branding.price_str = format_money(branding.price)
            branding.total_price_str = format_money(branding.total_price)
    delivery_price_str = format_money(order.delivery_option.price) if order.delivery_option and order.delivery_option.price > 0 else ''
    total_amount_str = format_money(order.total_amount)
    vat_amount_str = format_money(vat_amount)
    order_date_str = order.order_date.strftime('%d.%m.%Y') if order.order_date else ''
    state_changed_at_str = order.state_changed_at.strftime('%d.%m.%Y') if order.state_changed_at else ''
    
    # Конвертируем сумму в пропись
    total_amount_words = num2words(order.total_amount, lang='ru', to='currency', currency='RUB').capitalize()

    return render(request, 'pdf/invoice_pdf.html', {
        'order': order,
        'items': items,
        'vat_amount': vat_amount,
        'items_count': items_count,
        'delivery_price_str': delivery_price_str,
        'total_amount_str': total_amount_str,
        'vat_amount_str': vat_amount_str,
        'order_date_str': order_date_str,
        'state_changed_at_str': state_changed_at_str,
        'our_bank': our_bank,
        'invoice_no': generate_invoice_number(order),
        'branding_approved': get_branding_approved_date(order),
        'total_amount_words': total_amount_words,
    })
