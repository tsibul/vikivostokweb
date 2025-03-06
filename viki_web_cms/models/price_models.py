# from django.core.files.storage import FileSystemStorage

from django.db import models
from django.utils import timezone

from viki_web_cms.models import SettingsDictionary, Goods, CatalogueItem, GoodsGroup, StandardPriceType


# fs_product_group = FileSystemStorage(location='viki_web_cms/files/cover')
class Price(SettingsDictionary):
    """ price list dates"""
    price_list_date = models.DateField(default=timezone.now)
    promotion_price = models.BooleanField(default=False)
    promotion_end_date = models.DateField(null=True, blank=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Price List Date'
        verbose_name_plural = 'Price List Dates'
        db_table_comment = 'price'
        db_table = 'price'
        ordering = ['-price_list_date']

    def save(self, *args, **kwargs):
        self.name = self.price_list_date.strftime('%d.%m.%Y')
        super(Price, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['-price_list_date']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'price_list_date',
                'type': 'date',
                'label': 'дата',
                'null': False,
            },
            {
                'field': 'promotion_price',
                'type': 'number',
                'label': 'акция',
                'null': True,
            },
            {
                'field': 'promotion_end_date',
                'type': 'date',
                'label': 'конец акции',
                'null': True,
            },
        ]


class PriceGoodsStandard(SettingsDictionary):
    """ goods price list"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    price_type = models.ForeignKey(StandardPriceType, on_delete=models.CASCADE)
    price = models.FloatField(default=0)
    price_list = models.ForeignKey(Price, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Goods Price'
        verbose_name_plural = 'Goods Prices'
        db_table_comment = 'goods price'
        db_table = 'goods_price'
        ordering = ['goods__product_group__priority', 'goods__article', 'goods__name']

    def save(self, *args, **kwargs):
        self.name = self.goods.name + ' цена от ' + self.price_list.price_list_date.strftime('%d.%m.%Y')
        self.price = round(self.price, 2)
        super(PriceGoodsStandard, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['goods__product_group__priority', 'goods__article', 'goods__name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'goods',
                'type': 'foreign',
                'label': 'товар',
                'null': False,
                'foreignClass': 'Goods'
            },
            {
                'field': 'price',
                'type': 'float',
                'label': 'цена',
                'null': False,
            },
            {
                'field': 'price_type',
                'type': 'foreign',
                'label': 'тип цены',
                'null': False,
                'foreignClass': 'StandardPriceType'
            },
            {
                'field': 'price_list',
                'type': 'foreign',
                'label': 'прайс лист',
                'null': False,
                'foreignClass': 'Price'
            },
        ]


class PriceItemStandard(SettingsDictionary):
    """ item price list"""
    item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE)
    price_type = models.ForeignKey(StandardPriceType, on_delete=models.CASCADE)
    price = models.FloatField(default=0)
    price_list = models.ForeignKey(Price, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Item Price'
        verbose_name_plural = 'Item Prices'
        db_table_comment = 'item price'
        db_table = 'item_price'
        ordering = ['item__item_article']

    def save(self, *args, **kwargs):
        self.name = self.item.name + ' цена от ' + self.price_list.price_list_date.strftime('%d.%m.%Y')
        self.price = round(self.price, 2)
        super(PriceItemStandard, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['item__item_article']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'item',
                'type': 'foreign',
                'label': 'товар',
                'null': False,
                'foreignClass': 'CatalogueItem'
            },
            {
                'field': 'price',
                'type': 'float',
                'label': 'цена',
                'null': False,
            },
            {
                'field': 'price_type',
                'type': 'foreign',
                'label': 'тип цены',
                'null': False,
                'foreignClass': 'StandardPriceType'
            },
            {
                'field': 'price_list',
                'type': 'foreign',
                'label': 'прайс лист',
                'null': False,
                'foreignClass': 'Price'
            },
        ]
