from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import SettingsDictionary, LayoutType

fs_product_group = FileSystemStorage(location='viki_web_cms/files/cover')


class ProductGroup(SettingsDictionary):
    """ navigation sections"""
    second_name = models.CharField(max_length=120, blank=True, null=True)
    cover = models.FileField(upload_to=fs_product_group, storage=fs_product_group, blank=True, null=True)
    product_group_url = models.CharField(max_length=60)
    layout = models.ForeignKey(LayoutType, blank=True, null=True, on_delete=models.SET_NULL)
    priority = models.IntegerField(blank=True, null=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Раздел каталога'
        verbose_name_plural = 'Разделы каталога'
        db_table_comment = 'catalogue sections'
        db_table = 'product_group'
        ordering = ['priority', 'name']


    @property
    def cover_url(self):
        return f"/static/viki_web_cms/files/cover/{self.cover.name}" if self.cover else None

    @staticmethod
    def order_default():
        return ['priority', 'name']


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'second_name',
                'type': 'string',
                'label': 'пояснение',
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
                'type': 'image',
                'label': 'обложка',
                'null': True,
            },
        ]
