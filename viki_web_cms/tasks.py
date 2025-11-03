from celery import shared_task
import logging
from django.core.mail import EmailMessage
from viki_web_cms.models import Order

logger = logging.getLogger('order_processing')

@shared_task
def execute_order_state_action(order_id):
    """Асинхронное выполнение действия для заказа"""
    try:
        order = Order.objects.select_related(
            'state', 'customer', 'company', 'our_company', 'user_extension'
        ).get(pk=order_id)

        order.change_state_action(order.state)

    except Exception as e:
        logger.error(f"Error in async execution of change_state_action for order {order_id}: {str(e)}")

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