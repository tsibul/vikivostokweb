from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import SettingsDictionary, PrintType, PrintPlace, Goods

fs_layout = FileSystemStorage(location='static/viki_web_cms/files/layout')


class GoodsDimensions(SettingsDictionary):
    """ goods dimensions"""
    length = models.FloatField(default=0)
    width = models.FloatField(default=0)
    height = models.FloatField(default=0)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Размеры товара'
        verbose_name_plural = 'Размеры товаров'
        db_table_comment = 'Goods dimensions'
        db_table = 'goods_dimensions'
        ordering = ['name']

    def __str__(self):
        return str(self.length) + '*' + str(self.width) + '*' + str(self.height) + 'мм'

    def __repr__(self):
        return str(self.length) + '*' + str(self.width) + '*' + str(self.height) + 'мм'

    @staticmethod
    def order_default():
        return ['name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'length',
                'type': 'float',
                'label': 'длина',
                'null': True,
            },
            {
                'field': 'width',
                'type': 'float',
                'label': 'ширина',
                'null': True,
            },
            {
                'field': 'height',
                'type': 'float',
                'label': 'высота',
                'null': True,
            },
        ]


class PrintData(SettingsDictionary):
    """ print data"""
    length = models.FloatField(default=0)
    height = models.FloatField(default=0)
    print_type = models.ForeignKey(PrintType, on_delete=models.CASCADE)
    print_place = models.ForeignKey(PrintPlace, on_delete=models.CASCADE)
    color_quantity = models.IntegerField(default=2)
    place_quantity = models.IntegerField(default=1)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Данные печати'
        verbose_name_plural = 'Данные печати'
        db_table_comment = 'Printing data'
        db_table = 'printing_data'
        ordering = ['print_type', 'print_place']

    def __str__(self):
        return (self.print_type.name + ' ' + self.print_place.name +
                str(self.length) + '*' + str(self.height) + 'мм')

    def __repr__(self):
        return (self.print_type.name + ' ' + self.print_place.name +
                str(self.length) + '*' + str(self.height) + 'мм')

    # def save(self, *args, **kwargs):
    #     self.name = (self.print_type.name + ' ' + self.print_place.name +
    #                  str(self.length) + '*' + str(self.height) + 'мм')
    #     super(PrintData, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['print_type', 'print_place']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'print_type',
                'type': 'foreign',
                'label': 'тип',
                'null': False,
                'foreignClass': 'PrintType'
            },
            {
                'field': 'print_place',
                'type': 'foreign',
                'label': 'место',
                'null': False,
                'foreignClass': 'PrintPlace'
            },
            {
                'field': 'length',
                'type': 'float',
                'label': 'длина',
                'null': False,
            },
            {
                'field': 'height',
                'type': 'float',
                'label': 'высота',
                'null': False,
            },
            {
                'field': 'color_quantity',
                'type': 'number',
                'label': 'кол-во цветов',
                'null': False,
            },
            {
                'field': 'place_quantity',
                'type': 'number',
                'label': 'кол-во мест',
                'null': False,
            },

        ]


class PrintOpportunity(SettingsDictionary):
    """ printing opportunity"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    print_data = models.ForeignKey(PrintData, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Возможности печати'
        verbose_name_plural = 'Возможности печати'
        db_table_comment = 'Print opportunity'
        db_table = 'print_opportunity'
        ordering = ['print_data__print_type', 'print_data__print_place']

    def __str__(self):
        return self.goods.name + ' ' + str(self.print_data)

    def __repr__(self):
        return self.goods.name + ' ' + str(self.print_data)

    def save(self, *args, **kwargs):
        self.name = (self.goods.article + ' ' + self.print_data.print_type.name +
                     ' ' + self.print_data.print_place.name)
        super(PrintOpportunity, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['print_data__print_type', 'print_data__print_place']

    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'название',
                'null': True,
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'удалено',
            },
            {
                'field': 'goods',
                'type': 'foreign',
                'label': 'товар',
                'null': False,
                'foreignClass': 'Goods',
            },
            {
                'field': 'print_data',
                'type': 'foreign',
                'label': 'данные печати',
                'null': False,
                'foreignClass': 'PrintData'
            },
        ]


class PrintLayout(SettingsDictionary):
    """ print layout"""
    layout = models.FileField(storage=fs_layout)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Шаблон нанесения'
        verbose_name_plural = 'Шаблоны нанесения'
        db_table_comment = 'Print Layout'
        db_table = 'print_layout'

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'layout',
                'type': 'file',
                'label': 'шаблон',
                'null': False,
            },
        ]


class GoodsLayout(SettingsDictionary):
    """ goods layout"""
    layout = models.ForeignKey(PrintLayout, on_delete=models.CASCADE)
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Шаблон для товара'
        verbose_name_plural = 'Шаблоны для товара'
        db_table_comment = 'Goods Layout'
        db_table = 'goods_layout'
        ordering = ['goods__name']

    def __str__(self):
        return self.goods.name

    def __repr__(self):
        return self.goods.name

    def save(self, *args, **kwargs):
        self.name = self.goods.article + ' ' + self.goods.name
        super(GoodsLayout, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['goods__name']

    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'название',
                'null': True,
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'удалено',
            },
            {
                'field': 'goods',
                'type': 'foreign',
                'label': 'товар',
                'null': False,
                'foreignClass': 'Goods',
            },
            {
                'field': 'layout',
                'type': 'foreign',
                'label': 'шаблон',
                'null': False,
                'foreignClass': 'PrintLayout',
            },
        ]
