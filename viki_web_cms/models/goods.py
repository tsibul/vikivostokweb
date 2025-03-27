# from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import SettingsDictionary, ColorScheme, ProductGroup


# fs_goods = FileSystemStorage(location='viki_web_cms/files/goods')


class GoodsGroup(SettingsDictionary):
    """ goods groups"""
    goods_group_url = models.CharField(max_length=60)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Группа товара'
        verbose_name_plural = 'Группы товаров'
        db_table_comment = 'Goods group'
        db_table = 'goods_group'
        ordering = ['name']

    @staticmethod
    def order_default():
        return ['name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'goods_group_url',
                'type': 'string',
                'label': 'адрес страницы',
                'null': True,
            },
        ]


class GoodsOptionGroup(SettingsDictionary):
    """ goods options"""

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Модификация товара'
        verbose_name_plural = 'Модификации товаров'
        db_table_comment = 'Goods options'
        db_table = 'goods_option_group'
        ordering = ['name']

    @staticmethod
    def order_default():
        return ['name']


class Goods(SettingsDictionary):
    """
    Goods
    """
    article = models.CharField(max_length=120)
    additional_material = models.BooleanField(default=False)
    product_group = models.ForeignKey(ProductGroup, on_delete=models.SET_NULL, null=True)
    goods_group = models.ForeignKey(GoodsGroup, on_delete=models.SET_NULL, null=True)
    color_scheme = models.ForeignKey(ColorScheme, on_delete=models.SET_NULL, null=True, related_name='color_scheme')
    additional_color_scheme = models.ForeignKey(ColorScheme, on_delete=models.SET_NULL, blank=True, null=True,
                                                related_name='additional_color_scheme')
    details_number = models.IntegerField(default=1)
    multicolor = models.BooleanField(default=False)
    standard_price = models.BooleanField(default=True)
    # print_layout = models.FileField(upload_to=fs_goods, storage=fs_goods, blank=True, null=True)
    goods_option_group = models.ForeignKey(GoodsOptionGroup, on_delete=models.SET_NULL, null=True)
    dealer_price = models.BooleanField(default=True)
    weight = models.FloatField(null=True, blank=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        db_table_comment = 'goods'
        db_table = 'goods'
        ordering = ['article', 'name']

    # @property
    # def cover_url(self):
    #     return f"/static/viki_web_cms/files/goods/{self.print_layout.name}" if self.print_layout else None

    @staticmethod
    def order_default():
        return ['article', 'name']

    @staticmethod
    def dictionary_fields():
        return [{
            'field': 'article',
            'type': 'string',
            'label': 'артикул',
            'null': False,
        },
        ] + SettingsDictionary.dictionary_fields() + [
            {
                'field': 'additional_material',
                'type': 'boolean',
                'label': 'доп. материал',
            },
            {
                'field': 'product_group',
                'type': 'foreign',
                'label': 'группа каталога',
                'foreignClass': 'ProductGroup',
                'null': False,
            },
            {
                'field': 'goods_group',
                'type': 'foreign',
                'label': 'группа товаров',
                'foreignClass': 'GoodsGroup',
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
                'field': 'goods_option_group',
                'type': 'foreign',
                'label': 'опция',
                'foreignClass': 'GoodsOptionGroup',
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
                'field': 'standard_price',
                'type': 'boolean',
                'label': 'ст. прайс',
            },
            {
                'field': 'dealer_price',
                'type': 'boolean',
                'label': 'дил. цена',
            },
            {
                'field': 'weight',
                'type': 'float',
                'label': 'вес, г',
                'null': True,
            },
        ]

class GoodsOption(SettingsDictionary):
    """ goods options"""
    option_article = models.CharField(max_length=120)
    option_group = models.ForeignKey(GoodsOptionGroup, on_delete=models.SET_NULL, null=True)

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
            {
                'field': 'option_group',
                'type': 'foreign',
                'label': 'группа опций',
                'foreignClass': 'GoodsOptionGroup',
                'null': True,
            },

        ]
