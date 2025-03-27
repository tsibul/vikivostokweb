from django.db import models

from viki_web_cms.models import SettingsDictionary, Goods


class Box(SettingsDictionary):
    """ boxes """
    length = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    volume = models.FloatField()


    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Гофрокороб'
        verbose_name_plural = 'Гофрокороба'
        db_table_comment = 'Box'
        db_table = 'box'
        ordering = ['name']

    def save(self, *args, **kwargs):
        self.name = 'Гофрокороб ' + str(self.length) + '*' + str(self.width) + '*' + str(self.height)
        self.volume = round(float(int(self.length) * int(self.width) * int(self.height))/1000000000, 4)
        super(Box, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['name']

    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'название',
                'null': True
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'удалено',
            },
            {
                'field': 'length',
                'type': 'float',
                'label': 'длина',
                'null': False,
            },
            {
                'field': 'width',
                'type': 'number',
                'label': 'ширина',
                'null': False,
            },
            {
                'field': 'height',
                'type': 'number',
                'label': 'высота',
                'null': False,
            },
            {
                'field': 'volume',
                'type': 'precise',
                'label': 'объем',
                'null': True,
            },
        ]


class Packing(SettingsDictionary):
    """ goods groups"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    box = models.ForeignKey(Box, on_delete=models.CASCADE)
    quantity_in = models.IntegerField()
    box_weight = models.FloatField()

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Упаковка'
        verbose_name_plural = 'Упаковки'
        db_table_comment = 'Packing'
        db_table = 'packing'
        ordering = ['goods__article', 'goods__name']

    def save(self, *args, **kwargs):
        self.name = self.box.name
        super(Packing, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['goods__article', 'goods__name']

    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'название',
                'null': True
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'удалено',
            },
            {
                'field': 'goods',
                'type': 'foreign',
                'label': 'продукция',
                'null': False,
                'foreignClass': 'Goods',
            },
            {
                'field': 'box',
                'type': 'foreign',
                'label': 'упаковка',
                'null': False,
                'foreignClass': 'Box',
            },
            {
                'field': 'quantity_in',
                'type': 'number',
                'label': 'шт в коробе',
                'null': False,
            },
            {
                'field': 'box_weight',
                'type': 'float',
                'label': 'вес короба, кг',
                'null': True,
            },
        ]
