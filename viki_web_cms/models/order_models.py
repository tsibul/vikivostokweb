from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import UserExtension, Customer, Company

fs_branding = FileSystemStorage(location='viki_web_cms/files/branding')


class Order(models.Model):
    """ order"""
    order_no = models.CharField(max_length=17)
    order_date = models.DateField()
    user_extension = models.ForeignKey(UserExtension, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    days_to_deliver = models.IntegerField(null=True)
    total_amount = models.FloatField()
    delivery_date = models.DateField(null=True)
    customer_comment = models.CharField(max_length=400, null=True)
    branding_file = models.FileField(storage=fs_branding, null=True)
    # approved = models.BooleanField(default=False)
    # started = models.BooleanField(default=False)
    # deleted = models.BooleanField(default=False)
    # delivered = models.BooleanField(default=False)


    def __str__(self):
        return self.order_no

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        db_table_comment = 'order'
        db_table = 'order'
        ordering = ['-order_date', 'order_no']


    @property
    def file_url(self):
        return f"/static/viki_web_cms/files/branding/{self.branding.name}" if self.branding else None

    @staticmethod
    def storage_url():
        return '/static/viki_web_cms/files/branding/'

    @staticmethod
    def order_default():
        return ['-order_date', 'order_no']


    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'second_name',
                'type': 'string',
                'label': 'пояснение',
                'null': True,
            },
            {
                'field': 'short_name',
                'type': 'string',
                'label': 'имя в меню',
                'null': True,
            },
            {
                'field': 'product_group_url',
                'type': 'string',
                'label': 'адрес страницы',
                'null': True,
            },
            {
                'field': 'layout',
                'type': 'foreign',
                'label': 'тип макета страницы каталога',
                'foreignClass': 'LayoutType',
                'null': False,
            },
            {
                'field': 'priority',
                'type': 'number',
                'label': 'приоритет показа',
                'null': False,
            },
            {
                'field': 'cover',
                'type': 'file',
                'label': 'обложка',
                'url': '/static/viki_web_cms/files/cover/',
                'null': False,
            },
            {
                'field': 'cover_photo',
                'property_off' : 'cover',
                'type': 'image',
                'label': 'обложка',
                'url': '/static/viki_web_cms/files/cover/',
                'null': True,
            },
        ]
