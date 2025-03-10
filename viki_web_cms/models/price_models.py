# from django.core.files.storage import FileSystemStorage
import datetime

from django.db import models
from django.utils import timezone

from viki_web_cms.models import SettingsDictionary, Goods, CatalogueItem, GoodsGroup, StandardPriceType, PrintPlace, \
    PrintPriceGroup


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

    def _set_name(self):
        """Формирует name на основе price_list_date и promotion_end_date"""
        if not isinstance(self.price_list_date, datetime.date):
            self.price_list_date = datetime.datetime.strptime(self.price_list_date, '%Y-%m-%d')
        if not isinstance(self.promotion_end_date, datetime.date) and self.promotion_price:
            self.promotion_end_date = datetime.datetime.strptime(self.promotion_end_date, '%Y-%m-%d')
            if self.promotion_end_date < self.price_list_date:
                self.promotion_end_date = self.price_list_date
        self.name = self.price_list_date.strftime('%d.%m.%y')
        if self.promotion_price and self.promotion_end_date:
            self.name += f"-{self.promotion_end_date.strftime('%d.%m.%y')}"

    def save(self, *args, **kwargs):
        self._set_name()
        if self.promotion_end_date == '':
            self.promotion_end_date = None
        super().save(*args, **kwargs)

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
                'type': 'boolean',
                'label': 'акция',
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


class PriceGoodsQuantity(SettingsDictionary):
    """ price list dates"""
    quantity = models.IntegerField()

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Price Goods Quantity'
        verbose_name_plural = 'Price Goods Quantities'
        db_table_comment = 'price goods'
        db_table = 'price_goods_quantity'
        ordering = ['quantity']

    def _set_name(self):
        self.name = 'до ' + str(self.quantity)

    def save(self, *args, **kwargs):
        self._set_name()
        super().save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['quantity']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'quantity',
                'type': 'number',
                'label': 'тираж',
                'null': False,
            },
        ]


class PriceGoodsVolume(SettingsDictionary):
    """ goods price list"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    price_type = models.ForeignKey(StandardPriceType, on_delete=models.CASCADE)
    price = models.FloatField(default=0)
    price_list = models.ForeignKey(Price, on_delete=models.CASCADE)
    price_volume = models.ForeignKey(PriceGoodsQuantity, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Goods Price Volume'
        verbose_name_plural = 'Goods Prices Volume'
        db_table_comment = 'goods price volume'
        db_table = 'goods_price_volume'
        ordering = ['price_volume', 'goods__product_group__priority', 'goods__article', 'goods__name']

    def save(self, *args, **kwargs):
        self.name = self.goods.name + ' цена от ' + self.price_list.price_list_date.strftime('%d.%m.%Y')
        self.price = round(self.price, 2)
        super(PriceGoodsVolume, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['price_volume', 'goods__product_group__priority', 'goods__article', 'goods__name']

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
            {
                'field': 'price_volume',
                'type': 'foreign',
                'label': 'тираж',
                'null': False,
                'foreignClass': 'PriceGoodsQuantity'
            },
        ]


class PrintGroupToGoods(SettingsDictionary):
    """ goods to print group"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    print_place = models.ForeignKey(PrintPlace, on_delete=models.CASCADE, null=True, blank=True)
    print_price_group = models.ForeignKey(PrintPriceGroup, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Print Group To Goods'
        verbose_name_plural = 'Print Group to Goods'
        db_table_comment = 'print group to goods'
        db_table = 'print_group_to_goods'
        ordering = ['print_price_group', 'goods__article', 'goods__name']

    def save(self, *args, **kwargs):
        self.name = self.goods.name + ' ' + self.print_price_group.print_type.name + ' ' + str(self.print_place)
        super(PrintGroupToGoods, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['print_price_group', 'goods__article', 'goods__name']

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
                'field': 'print_place',
                'type': 'foreign',
                'label': 'место нанесения',
                'null': True,
                'foreignClass': 'PrintPlace'
            },
            {
                'field': 'print_price_group',
                'type': 'foreign',
                'label': 'ценовая группа',
                'null': False,
                'foreignClass': 'PrintPriceGroup'
            },
        ]
