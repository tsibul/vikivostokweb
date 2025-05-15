from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from datetime import datetime
import os
from viki_web_cms.models import Order, OrderMailLog, Invoice


def get_branding_approved_date(order):
    """Получает дату утверждения макета из лога"""
    try:
        log_entry = OrderMailLog.objects.filter(
            order=order,
            comment__contains=f"статус по заказу {order.order_no} макет подтвержден"
        ).first()
        return log_entry.email_date if log_entry else None
    except:
        return None

def generate_invoice_number(order):
    """Генерирует номер счета в формате NNNN/XXXXXX"""
    # Получаем первый день текущего года
    year_start = timezone.now().replace(month=1, day=1)
    
    # Считаем количество счетов текущего года для данной компании
    invoice_count = Invoice.objects.filter(
        order__our_company=order.our_company,
        invoice_date__gte=year_start,
        deleted=False
    ).count()
    
    # Формируем номер
    number = str(invoice_count + 1).zfill(4)  # 4 цифры с ведущими нулями
    order_suffix = order.order_no[-6:]  # последние 6 символов номера заказа
    
    return f"{number}W/{order_suffix}"
