from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import SettingsDictionary, LayoutType, ColorScheme

fs_goods = FileSystemStorage(location='viki_web_cms/files/goods')


class Goods(SettingsDictionary):
    """
    Goods
    """
    article = models.CharField(max_length=120)
    additional_material = models.BooleanField(default=False)
    color_scheme = models.ForeignKey(ColorScheme, on_delete=models.SET_NULL, null=True, related_name='color_scheme')
    additional_color_scheme = models.ForeignKey(ColorScheme, on_delete=models.SET_NULL, blank=True, null=True, related_name='additional_color_scheme')
    details_number = models.IntegerField(default=1)
    multicolor = models.BooleanField(default=False)
    print_layout = models.FileField(upload_to=fs_goods, storage=fs_goods, blank=True, null=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        db_table_comment = 'goods'
        db_table = 'goods'
        ordering = ['article', 'name']

    @property
    def cover_url(self):
        return f"/static/viki_web_cms/files/goods/{self.print_layout.name}" if self.print_layout else None

    @staticmethod
    def order_default():
        return ['article', 'name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'article',
                'type': 'string',
                'label': 'артикул',
                'null': False,
            },
            {
                'field': 'additional_material',
                'type': 'boolean',
                'label': 'доп. материал',
                'null': True,
            },
            {
                'field': 'color_scheme',
                'type': 'foreign',
                'label': 'осн. цвет',
                'foreignClass': 'ColorScheme',
                'null': False,
            },
            {
                'field': 'additional_color_scheme',
                'type': 'foreign',
                'label': 'доп. цвет',
                'foreignClass': 'ColorScheme',
                'null': True,
            },
            {
                'field': 'details_number',
                'type': 'number',
                'label': 'кол-во деталей',
                'null': False,
            },
            {
                'field': 'multicolor',
                'type': 'boolean',
                'label': 'микс',
            },
            {
                'field': 'details_number',
                'type': 'number',
                'label': 'кол-во деталей',
                'null': False,
            },
            {
                'field': 'print_layout',
                'type': 'file',
                'label': 'макет нанесения',
                'null': True,
            },
        ]


class GoodsOption(SettingsDictionary):
    """ goods options"""
    option_article = models.CharField(max_length=120)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Модификация товара'
        verbose_name_plural = 'Модификации товаров'
        db_table_comment = 'Goods options'
        db_table = 'goods_options'
        ordering = ['name']

    @staticmethod
    def order_default():
        return ['name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'option_article',
                'type': 'string',
                'label': 'артикул опции',
                'null': False,
            },
        ]


class GoodsToOption(SettingsDictionary):
    """ goods vs options corresponding """
    goods = models.ForeignKey(Goods, on_delete=models.SET_NULL, null=True)
    goods_options = models.ForeignKey(GoodsOption, on_delete=models.SET_NULL, null=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Связь модификация-товар'
        verbose_name_plural = 'Связи модификация-товар'
        db_table_comment = 'Goods  to options'
        db_table = 'goods_to_options'
        ordering = ['name']

    @staticmethod
    def order_default():
        return ['name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'goods',
                'type': 'foreign',
                'label': 'товар',
                'null': False,
                'foreignClass': 'Goods',
            },
            {
                'field': 'goods_options',
                'type': 'foreign',
                'label': 'опция',
                'null': False,
                'foreignClass': 'GoodsOptions',
            },
        ]
