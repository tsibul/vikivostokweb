from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.db import models, transaction
from django.utils import timezone

from viki_web_cms.models import UserExtension, Customer, Company, SettingsDictionary, OurCompany, CatalogueItem, \
    PrintType, PrintPlace, DeliveryOption

fs_branding = FileSystemStorage(location='viki_web_cms/files/order/branding')
fs_invoice = FileSystemStorage(location='viki_web_cms/files/order/invoice')
fs_order = FileSystemStorage(location='viki_web_cms/files/order/order')


class OrderState(SettingsDictionary):
    """ navigation sections"""
    order = models.IntegerField(default=1)
    action = models.CharField(max_length=50, blank=True, null=True)

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
    order_file = models.FileField(storage=fs_order, null=True)
    state = models.ForeignKey(OrderState, on_delete=models.PROTECT, related_name='orders')
    previous_state = models.ForeignKey(OrderState, on_delete=models.SET_NULL, null=True, related_name='previous_orders')
    state_changed_at = models.DateTimeField(auto_now=False, null=True)
    user_edited =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_edited')
    user_responsible =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_responsible')
    delivery_option = models.ForeignKey(DeliveryOption, on_delete=models.SET_NULL, null=True, related_name='delivery_option')

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
                from django.conf import settings
                if hasattr(settings, 'CELERY_ENABLED') and settings.CELERY_ENABLED:
                    # Асинхронный запуск
                    from viki_web_cms.tasks import execute_order_state_action
                    execute_order_state_action.delay(self.pk, self.state.action)
                else:
                    # Синхронное выполнение, если Celery не настроен
                    self.execute_state_action(self.state.action)
            except (ImportError, AttributeError):
                # Fallback на синхронное выполнение, если не удалось импортировать модули
                self.execute_state_action(self.state.action)
            except Exception as e:
                # Обработка прочих ошибок
                import logging
                logger = logging.getLogger('order_processing')
                logger.error(f"Error handling state change for order {self.order_no}: {str(e)}")

    def execute_state_action(self, action_name):
        """Выполняет предопределенное действие по имени"""
        try:
            # Стандартные операции
            match action_name:
                case 'send_confirmation_email':
                    self.send_confirmation_email()
                case 'create_production_task':
                    self.create_production_task()
                case 'notify_customer_ready':
                    self.notify_customer_ready()
                case 'complete_and_archive':
                    self.complete_and_archive()
                case 'cancel_and_refund':
                    self.cancel_and_refund()
                case 'send_branding_email':
                    self.send_branding_email()
        except Exception as e:
            # Логирование ошибок выполнения
            import logging
            logger = logging.getLogger('order_processing')
            logger.error(f"Error executing action '{action_name}' for order {self.order_no}: {str(e)}")
            # В реальном коде здесь может быть отправка уведомления администраторам

    # Конкретные методы для каждого действия
    def send_branding_email(self):
        # Логика отправки email подтверждения
        pass

    def send_confirmation_email(self):
        # Логика отправки email подтверждения
        pass

    def create_production_task(self):
        # Логика создания задачи на производство
        pass

    def notify_customer_ready(self):
        # Логика уведомления клиента о готовности
        pass

    def complete_and_archive(self):
        # Логика завершения и архивирования заказа
        pass

    def cancel_and_refund(self):
        # Логика отмены и возврата средств
        pass
        
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
