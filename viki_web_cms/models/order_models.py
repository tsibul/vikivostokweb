import logging

from datetime import datetime
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.core.mail import EmailMessage
from django.db import models, transaction
from django.utils import timezone
from django.conf import settings

from viki_web_cms.models import UserExtension, Customer, Company, SettingsDictionary, OurCompany, CatalogueItem, \
    PrintType, PrintPlace, DeliveryOption

fs_branding = FileSystemStorage(location='viki_web_cms/files/order/branding')
fs_invoice = FileSystemStorage(location='viki_web_cms/files/order/invoice')
fs_delivery = FileSystemStorage(location='viki_web_cms/files/order/delivery')


class OrderState(SettingsDictionary):
    """ navigation sections"""
    order = models.IntegerField(default=1)
    action = models.CharField(max_length=50, blank=True, null=True)
    message_text = models.CharField(max_length=400, blank=True, null=True)
    alternate_message_text = models.CharField(max_length=400, blank=True, null=True)
    two_messages = models.BooleanField(default=False)
    from_client = models.BooleanField(default=False)
    attachments = models.BooleanField(default=False)
    branding = models.BooleanField(default=False)
    invoice = models.BooleanField(default=False)
    delivery = models.BooleanField(default=False)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Состояние заказа'
        verbose_name_plural = 'Состояния заказа'
        db_table_comment = 'order state'
        db_table = 'order_state'
        ordering = ['order']

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    @staticmethod
    def order_default():
        return ['order']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'action',
                'type': 'string',
                'label': 'действие при переходе',
                'null': True,
            },
            {
                'field': 'order',
                'type': 'number',
                'label': 'порядковый номер',
                'null': False,
            },
            {
                'field': 'message_text',
                'type': 'textarea',
                'label': 'сообщение',
                'null': True,
            },
            {
                'field': 'two_messages',
                'type': 'boolean',
                'label': '2 сообщения',
            },
            {
                'field': 'alternate_message_text',
                'type': 'textarea',
                'label': 'второе сообщение',
                'null': True,
            },
            {
                'field': 'from_client',
                'type': 'boolean',
                'label': 'от клиента',
            },
            {
                'field': 'branding',
                'type': 'boolean',
                'label': 'макет',
            },
            {
                'field': 'invoice',
                'type': 'boolean',
                'label': 'счет',
            },
            {
                'field': 'delivery',
                'type': 'boolean',
                'label': 'накладная',
            },

        ]


class Order(models.Model):
    """ order"""
    order_no = models.CharField(max_length=17)
    order_date = models.DateField()
    user_extension = models.ForeignKey(UserExtension, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True)
    our_company = models.ForeignKey(OurCompany, on_delete=models.SET_NULL, null=True)
    days_to_deliver = models.IntegerField(null=True)
    total_amount = models.FloatField()
    delivery_date = models.DateField(null=True)
    customer_comment = models.CharField(max_length=400, null=True)
    branding_file = models.FileField(storage=fs_branding, null=True)
    invoice_file = models.FileField(storage=fs_invoice, null=True)
    delivery_file = models.FileField(storage=fs_delivery, null=True)
    state = models.ForeignKey(OrderState, on_delete=models.PROTECT, related_name='orders')
    previous_state = models.ForeignKey(OrderState, on_delete=models.SET_NULL, null=True, related_name='previous_orders')
    state_changed_at = models.DateTimeField(auto_now=False, null=True)
    user_edited = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_edited')
    user_responsible = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_responsible')
    delivery_option = models.ForeignKey(DeliveryOption, on_delete=models.SET_NULL, null=True,
                                        related_name='delivery_option')
    order_short_number = models.IntegerField()

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        db_table_comment = 'order'
        db_table = 'order'
        ordering = ['-order_date', 'order_no']

    def __str__(self):
        return self.order_no + ' ' + self.company.name

    def __repr__(self):
        return self.order_no + ' ' + self.company.name

    @staticmethod
    def order_default():
        return ['-order_date', 'order_no']

    @transaction.atomic
    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not is_new:
            # Оптимизируем запрос для получения предыдущего состояния
            old_instance = Order.objects.select_related('state').only('state').get(pk=self.pk)
            old_state = old_instance.state
        else:
            old_state = None

        # Сохраняем объект
        super().save(*args, **kwargs)

        # Если состояние изменилось, выполняем действие
        if not is_new and old_state != self.state and self.state.action:
            # Обновляем поля без повторного сохранения всего объекта
            Order.objects.filter(pk=self.pk).update(
                previous_state=old_state,
                state_changed_at=timezone.now()
            )

            # Выполняем действие (асинхронно или синхронно в зависимости от настроек)
            try:
                # Проверяем, настроен ли Celery
                # from django.conf import settings
                if hasattr(settings, 'CELERY_ENABLED') and settings.CELERY_ENABLED:
                    # Асинхронный запуск
                    from viki_web_cms.tasks import execute_order_state_action
                    execute_order_state_action.delay(self.pk)
                else:
                    # Синхронное выполнение, если Celery не настроен
                    self.change_state_action(self.state)
            except (ImportError, AttributeError):
                # Fallback на синхронное выполнение, если не удалось импортировать модули
                self.change_state_action(self.state)
            except Exception as e:
                # Обработка прочих ошибок
                # import logging
                logger = logging.getLogger('order_processing')
                logger.error(f"Error handling state change for order {self.order_no}: {str(e)}")

    @staticmethod
    def send_order_mail(order, recipients, from_email, subject, message, user, attachment_fields=None):
        """
        Отправляет письмо и создает записи в логе.
        Args:
            :param order: (Order): объект заказа
            :param recipients: (list) список получателей
            :param from_email: (str): адрес отправителя
            :param subject: (str): тема письма
            :param message: (str): текст письма
            attachment_fields (list): список имен полей из модели Order для вложений
            :param attachment_fields: (list) список имен полей из модели Order для вложений
            :param user:  (User)
        """
        # Отправляем письмо
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=from_email,
            to=recipients
        )

        # Добавляем вложения из указанных полей
        attachments = None
        if attachment_fields:
            file_field = getattr(order, attachment_fields, None)
            if file_field and file_field.name:
                email.attach_file(file_field.path)
                attachments = file_field.name

        email.send()

        # Логируем отправку для каждого получателя
        for recipient in recipients:
            OrderMailLog.objects.create(
                order=order,
                email_date=timezone.now().date(),
                email_recipient=recipient,
                comment=message,
                attachments=attachments,
                user=user
            )

    def change_state_action(self, action: OrderState):
        customer_manager = self.user_extension.user
        customer_manager_mail = customer_manager.email
        our_mail = self.user_responsible.email if self.user_responsible else 'office@vikivostok.ru'
        subject = f"заказ {self.order_no} {action.name}"
        if action.from_client:
            message = f"статус по заказу {self.order_no} {action.name} \n {action.message_text}"
            from_email = 'web-order@vikivostok.ru'
            user_created = customer_manager
            if self.user_responsible:
                email_recipient = [our_mail, 'office@vikivostok.ru']
            else:
                email_recipient = [our_mail]
        else:
            message = f"Добрый день,\n\nстатус по заказу {self.order_no} {action.name} \n {action.message_text}\n\nВики Восток"
            from_email = our_mail
            user_created = self.user_edited
            email_recipient = [customer_manager_mail]
        attachment_names = []
        if action.attachments:
            if action.branding:
                attachment_names = 'branding_file'
            if action.invoice:
                attachment_names = 'invoice_file'
            if action.delivery:
                attachment_names = 'delivery_file'
        Order.send_order_mail(
            order=self,
            recipients=email_recipient,
            from_email=from_email,
            subject=subject,
            message=message,
            user=user_created,
            attachment_fields=attachment_names if attachment_names else None,
        )
        if action.two_messages:
            message_2 = f"Добрый день,\n\nстатус по заказу {self.order_no} {action.name} \n {action.alternate_message_text}\n\nВики Восток"
            from_email_2 = our_mail
            user_created_2 = customer_manager
            email_recipient_2 = [customer_manager_mail]
            Order.send_order_mail(
                order=self,
                recipients=email_recipient_2,
                from_email=from_email_2,
                subject=subject,
                message=message_2,
                user=user_created_2,
                attachment_fields=None,
            )


    # Методы для оптимизированной загрузки данных
    @classmethod
    def get_order_with_items(cls, order_id):
        """Получить заказ со всеми товарами и брендированием"""
        return cls.objects.select_related(
            'state', 'previous_state', 'customer', 'company', 'our_company', 'user_extension'
        ).prefetch_related(
            'orderitem_set',  # Все товары заказа
            'orderitem_set__item',  # Данные товаров из каталога
            'orderitem_set__orderitembranding_set',  # Брендирование для каждого товара
            'orderitem_set__orderitembranding_set__print_type',  # Типы печати
            'orderitem_set__orderitembranding_set__print_place'  # Места печати
        ).get(pk=order_id)

    @classmethod
    def get_orders_for_list(cls, **filters):
        """Оптимизированная загрузка списка заказов для отображения в таблице"""
        return cls.objects.select_related(
            'state', 'customer', 'company'
        ).filter(**filters).order_by(*cls.order_default())

    @classmethod
    def get_orders_by_state(cls, state_code):
        """Получить все заказы в определенном состоянии"""
        return cls.objects.select_related(
            'state', 'customer', 'company'
        ).filter(state__code=state_code).order_by(*cls.order_default())

    @classmethod
    def get_orders_for_customer(cls, customer_id):
        """Получить все заказы определенного клиента"""
        return cls.objects.select_related(
            'state', 'customer', 'company'
        ).filter(customer_id=customer_id).order_by(*cls.order_default())

    @classmethod
    def get_active_orders_for_user(cls, user_extension):
        """Получить активные заказы пользователя (не доставлены/не отменены)"""
        return cls.objects.select_related(
            'state', 'company', 'user_extension', 'user_responsible', 'delivery_option'
        ).filter(
            user_extension=user_extension
        ).exclude(
            state__action__in=['order_delivered', 'order_cancelled']
        ).order_by('-order_date')

    @classmethod
    def get_completed_orders_for_user(cls, user_extension):
        """Получить завершенные заказы пользователя (доставлены/отменены)"""
        return cls.objects.select_related(
            'state', 'company', 'user_extension', 'user_responsible', 'delivery_option'
        ).filter(
            user_extension=user_extension,
            state__action__in=['order_delivered', 'order_cancelled']
        ).order_by('-order_date')

    @classmethod
    def get_active_orders_for_customer(cls, customer):
        """Получить активные заказы пользователя (не доставлены/не отменены)"""
        return cls.objects.select_related(
            'state', 'customer', 'company', 'user_extension', 'user_responsible', 'delivery_option'
        ).filter(
            customer=customer
        ).exclude(
            state__action__in=['order_delivered', 'order_cancelled']
        ).order_by('-order_date')

    @classmethod
    def get_completed_orders_for_customer(cls, customer):
        """Получить завершенные заказы пользователя (доставлены/отменены)"""
        return cls.objects.select_related(
            'state', 'customer', 'company', 'user_extension', 'user_responsible', 'delivery_option'
        ).filter(
            customer=customer,
            state__action__in=['order_delivered', 'order_cancelled']
        ).order_by('-order_date')

    @classmethod
    def has_price_changes(cls, order, current_date=None):
        """
        Проверяет наличие изменений цен для заказа
        Не изменяет состояние заказа, только проверяет
        
        :param order: Объект заказа
        :param current_date: Дата для проверки (по умолчанию текущая)
        :return: bool - True если найдены изменения цен, False в противном случае
        """
        from viki_web_cms.models import Price

        if current_date is None:
            current_date = timezone.now().date()

        # Проверка стандартных обновлений цен
        has_price_updates = Price.objects.filter(
            deleted=False,
            price_list_date__gte=order.order_date,
            price_list_date__lte=current_date
        ).exists()

        # Если обычных обновлений не найдено, проверяем промо-цены
        if not has_price_updates:
            # Проверка появления новых промо-цен после даты заказа
            new_promo_prices = Price.objects.filter(
                deleted=False,
                promotion_price=True,
                price_list_date__gt=order.order_date,
                price_list_date__lte=current_date
            ).exists()

            # Проверка окончания действия промо-цен, которые действовали на дату заказа
            ended_promo_prices = Price.objects.filter(
                deleted=False,
                promotion_price=True,
                price_list_date__lte=order.order_date,
                promotion_end_date__lt=current_date,
                promotion_end_date__gte=order.order_date
            ).exists()

            has_price_updates = new_promo_prices or ended_promo_prices

        return has_price_updates

    def has_branding(self):
        """
        Проверяет наличие брендирования в заказе.
        Returns:
            bool: True если в заказе есть хотя бы один товар с брендированием, False в противном случае
        """
        return self.orderitem_set.filter(orderitembranding__isnull=False).exists()


class OrderItem(models.Model):
    """ order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(CatalogueItem, on_delete=models.SET_NULL, null=True)
    price = models.FloatField()
    quantity = models.IntegerField()
    total_price = models.FloatField()
    branding_name = models.CharField(max_length=120)

    class Meta:
        verbose_name = 'Товар в заказе'
        verbose_name_plural = 'Товары в заказе'
        db_table_comment = 'order item'
        db_table = 'order_item'
        ordering = ['-order__order_date', 'order__order_no', 'item__item_article']

    def __str__(self):
        return self.item.item_article + ' ' + self.item.name

    def __repr__(self):
        return self.item.item_article + ' ' + self.item.name

    @staticmethod
    def order_default():
        return ['-order__order_date', 'order__order_no', 'item__item_article']


class OrderItemBranding(models.Model):
    """ order"""
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    print_type = models.ForeignKey(PrintType, on_delete=models.SET_NULL, null=True)
    print_place = models.ForeignKey(PrintPlace, on_delete=models.SET_NULL, null=True)
    colors = models.IntegerField()
    second_pass = models.BooleanField()
    price = models.FloatField()
    total_price = models.FloatField()

    class Meta:
        verbose_name = 'Брендирование товара в заказе'
        verbose_name_plural = 'Брендирования товара в заказе'
        db_table_comment = 'order item branding'
        db_table = 'order_item_branding'
        ordering = ['-order_item__order__order_date', 'order_item__order__order_no', 'order_item__item__item_article',
                    'print_type', 'print_place']

    def __str__(self):
        pass_name = ' второй проход' if self.second_pass else None
        return self.print_type.name + ' ' + self.print_place.name + ', цветов' + str(self.colors) + pass_name

    def __repr__(self):
        pass_name = ' второй проход' if self.second_pass else None
        return self.print_type.name + ' ' + self.print_place.name + ', цветов' + str(self.colors) + pass_name

    @staticmethod
    def order_default():
        return ['-order_item__order__order_date', 'order_item__order__order_no', 'order_item__item__item_article',
                'print_type', 'print_place']


class OrderComment(models.Model):
    comment_date = models.DateField()
    comment = models.CharField(max_length=400)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Комментарий к заказу'
        verbose_name_plural = 'Комментарии к заказу'
        db_table_comment = 'order comment'
        db_table = 'order_comment'
        ordering = ['-order__order_date', 'order__order_no', '-comment_date']

    def __str__(self):
        return self.order.order_no + ' ' + datetime.strftime(self.comment_date, '%d.%m.%y')

    def __repr__(self):
        return self.order.order_no + ' ' + datetime.strftime(self.comment_date, '%d.%m.%y')

    def save(self, *args, **kwargs):
        self.comment_date = timezone.now().date()
        super(OrderComment, self).save(*args, **kwargs)
        self.send_comment_notification()

    def send_comment_notification(self):
        """
        Отправляет уведомление о комментарии на email.
        """
        from viki_web_cms.tasks import send_comment_email

        # Получаем заказ
        order = self.order

        # Формируем список получателей
        recipients = ['office@vikivostok.ru']
        if order.user_responsible and order.user_responsible.email:
            recipients.append(order.user_responsible.email)

        # Формируем тему письма
        subject = f"сообщение по заказу {order.order_no}"

        # Текст письма
        message = self.comment

        # Отправляем письмо асинхронно
        send_comment_email.delay(recipients, subject, message, 'web-orders@vikivostok.ru')

    @staticmethod
    def order_default():
        return ['-order__order_date', 'order__order_no', '-comment_date']


class OrderMailLog(models.Model):
    email_date = models.DateField()
    email_recipient = models.CharField(max_length=200)
    comment = models.CharField(max_length=400)
    attachments = models.CharField(max_length=400, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Почтовое сообщение к заказу'
        verbose_name_plural = 'Почтовые сообщения к заказу'
        db_table_comment = 'order mail log'
        db_table = 'order_mail_log'
        ordering = ['-order__order_date', 'order__order_no', '-email_date']

    def __str__(self):
        return self.order.order_no + ' ' + datetime.strftime(self.email_date, '%d.%m.%y')

    def __repr__(self):
        return self.order.order_no + ' ' + datetime.strftime(self.email_date, '%d.%m.%y')

    def save(self, *args, **kwargs):
        self.email_date = timezone.now().date()
        super(OrderMailLog, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['-order__order_date', 'order__order_no', '-email_date']


class Invoice(SettingsDictionary):
    invoice_date = models.DateField()
    invoice_no = models.CharField(max_length=400)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Счет'
        verbose_name_plural = 'Счета'
        db_table_comment = 'invoice'
        db_table = 'invoice'
        ordering = ['-order__order_date', 'order__order_no', '-invoice_date']

    def __str__(self):
        return self.invoice_no + ' ' + datetime.strftime(self.invoice_date, '%d.%m.%y')

    def __repr__(self):
        return self.invoice_no + ' ' + datetime.strftime(self.invoice_date, '%d.%m.%y')

    def save(self, *args, **kwargs):
        self.name = self.order.order_no + ' ' + self.order.customer.name
        super(Invoice, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['-order__order_date', 'order__order_no', '-invoice_date']


    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'заказ',
                'null': True,
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'уд.',
            },
            {
                'field': 'invoice_no',
                'type': 'string',
                'label': 'номер',
                'null': False,
            },
            {
                'field': 'invoice_no',
                'type': 'date',
                'label': 'дата',
                'null': False,
            },

        ]
