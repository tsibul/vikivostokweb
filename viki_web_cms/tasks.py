from celery import shared_task
import logging
from django.core.mail import EmailMessage

logger = logging.getLogger('order_processing')

@shared_task
def execute_order_state_action(order_id, action_name):
    """Асинхронное выполнение действия для заказа"""
    from viki_web_cms.models import Order
    
    try:
        order = Order.objects.select_related(
            'state', 'customer', 'company', 'our_company', 'user_extension'
        ).get(pk=order_id)
        
        # Вызываем внутренний метод выполнения действия
        method_mapping = {
            'order_created': order.order_created,
            'branding_request': order.branding_request,
            'wait_branding_approve': order.wait_branding_approve,
            'branding_approved': order.branding_approved,
            'price_changed': order.price_changed,
            'new_price_approved': order.new_price_approved,
            'order_approved': order.order_approved,
            'order_in_work': order.order_in_work,
            'order_ready': order.order_ready,
            'order_delivered': order.order_delivered,
            'order_cancelled': order.order_cancelled
        }
        
        # Выполняем действие, если оно определено в маппинге
        if action_name in method_mapping:
            # Отключаем INFO логирование, оставляем только для отладки
            # logger.info(f"Executing async action '{action_name}' for order {order.order_no}")
            method_mapping[action_name]()
            # logger.info(f"Successfully completed action '{action_name}' for order {order.order_no}")
        else:
            logger.warning(f"Unknown action '{action_name}' for order {order_id}")
        
    except Exception as e:
        logger.error(f"Error in async execution of '{action_name}' for order {order_id}: {str(e)}")

@shared_task
def send_comment_email(recipients, subject, message, from_email):
    """
    Отправляет email с комментарием к заказу.
    """
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=from_email,
        to=recipients,
    )
    email.send() 