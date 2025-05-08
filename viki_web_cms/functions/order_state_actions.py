from viki_web_cms.models import Order


def order_created(order):
    """Действие при создании заказа"""
    # Формируем список получателей
    recipients = ['office@vikivostok.ru']
    if order.user_responsible:
        recipients.append(order.user_responsible.email)

    # Формируем текст сообщения
    message_lines = [
        f"Заказ {order.order_no} создан",
        f"Клиент: {order.customer.name}",
        f"Менеджер: {order.user_extension.user.get_full_name()}"
    ]
    
    if order.user_extension.phone:
        message_lines.append(f"Телефон: {order.user_extension.phone}")
    
    message_lines.append(f"Почта: {order.user_extension.user.email}")

    message = "\n".join(message_lines)

    # Отправляем письмо
    Order.send_order_mail(
        order=order,
        recipients=recipients,
        from_email='web-orders@vikivostok.ru',
        subject=f"Заказ {order.order_no} создан",
        message=message,
        user=order.user_extension.user
    )


def branding_request(order):
    """Действие при запросе макета"""
    # Определяем отправителя
    from_email = order.user_responsible.email if order.user_responsible else 'office@vikivostok.ru'
    
    # Получатель - email пользователя, создавшего заказ
    recipients = [order.user_extension.user.email]

    # Формируем текст сообщения
    message = """Добрый день!
для подтверждения заказа просим прислать макет нанесения в векторном формате:
 pdf или Corel (не выше 18 версии) или eps

заранее спасибо
команда Вики Восток"""

    # Отправляем письмо
    Order.send_order_mail(
        order=order,
        recipients=recipients,
        from_email=from_email,
        subject=f"запрос макета по заказу {order.order_no}",
        message=message,
        user=order.user_edited
    )


def wait_branding_approve(order):
    """Действие при ожидании подтверждения макета"""
    # Определяем отправителя
    from_email = order.user_responsible.email if order.user_responsible else 'office@vikivostok.ru'
    
    # Получатель - email пользователя, создавшего заказ
    recipients = [order.user_extension.user.email]

    # Формируем текст сообщения
    message = f"""Добрый день!
Готов макет по вашему заказу {order.order_no}.
Просьба ознакомиться и подтвердить его на странице списка заказов:
Кнопка "Действия" - "подтвердить макет"
Если требуется доработка - отправьте сообщение:
Кнопка "Действия" - "отправить соощение"

заранее спасибо
команда Вики Восток"""

    # Отправляем письмо с вложением макета
    Order.send_order_mail(
        order=order,
        recipients=recipients,
        from_email=from_email,
        subject=f"подтвердите макет по заказу {order.order_no}",
        message=message,
        user=order.user_edited,
        attachment_fields=['branding_file']
    )


def branding_approved(order):
    """Действие при подтверждении макета"""
    # Первое письмо - уведомление в офис
    office_recipients = ['office@vikivostok.ru']
    if order.user_responsible:
        office_recipients.append(order.user_responsible.email)

    office_message = f"""макет по заказу {order.order_no} подтвержден
клиент: {order.customer.name}"""

    Order.send_order_mail(
        order=order,
        recipients=office_recipients,
        from_email='web-orders@vikivostok.ru',
        subject=f"заказ {order.order_no} подтвержден",
        message=office_message,
        user=order.user_edited
    )

    # Второе письмо - уведомление клиенту
    client_message = f"""Добрый день!
Вы подтвердили макет по вашему заказу {order.order_no}.

Команда Вики Восток"""

    Order.send_order_mail(
        order=order,
        recipients=[order.user_extension.user.email],
        from_email=order.user_responsible.email if order.user_responsible else 'office@vikivostok.ru',
        subject=f"вы подтвердили макет по заказу {order.order_no}",
        message=client_message,
        user=order.user_edited
    )


def price_changed(order):
    """Действие при изменении цены"""
    # Формируем список получателей
    recipients = ['office@vikivostok.ru']
    if order.user_responsible:
        recipients.append(order.user_responsible.email)

    # Формируем текст сообщения
    message = f"""по заказу {order.order_no} изменилась цена
клиент: {order.customer.name}"""

    # Отправляем письмо
    Order.send_order_mail(
        order=order,
        recipients=recipients,
        from_email='web-orders@vikivostok.ru',
        subject=f"по заказу {order.order_no} изменилась цена",
        message=message,
        user=order.user_extension.user 
    )


def new_price_approved(order):
    """Действие при подтверждении новых цен"""
    # Первое письмо - уведомление в офис
    office_recipients = ['office@vikivostok.ru']
    if order.user_responsible:
        office_recipients.append(order.user_responsible.email)

    office_message = f"""новые цены по заказу {order.order_no} подтверждены
клиент: {order.customer.name}"""

    Order.send_order_mail(
        order=order,
        recipients=office_recipients,
        from_email='web-orders@vikivostok.ru',
        subject=f"новые цены по заказу {order.order_no} подтверждены",
        message=office_message,
        user=order.user_extension.user
    )

    # Второе письмо - уведомление клиенту
    client_message = f"""Добрый день!
Вы подтвердили новые цены по заказу {order.order_no}.

Команда Вики Восток"""

    Order.send_order_mail(
        order=order,
        recipients=[order.user_extension.user.email],
        from_email=order.user_responsible.email if order.user_responsible else 'office@vikivostok.ru',
        subject=f"вы подтвердили новые цены по заказу {order.order_no}",
        message=client_message,
        user=order.user_extension.user
    )


def order_approved(order):
    pass


def order_in_work(self):
    pass


def order_ready(self):
    pass


def order_delivered(self):
    pass


def order_cancelled(self):
    pass
