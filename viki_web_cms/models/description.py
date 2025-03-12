from django.db import models

from viki_web_cms.models import SettingsDictionary, Goods


class GoodsDescription(SettingsDictionary):
    """ goods description """
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    description = models.CharField(max_length=250)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Goods Description'
        verbose_name_plural = 'Goods Descriptions'
        db_table_comment = 'goods description'
        db_table = 'goods_description'
        ordering = ['goods__article', 'goods__name']

    def save(self, *args, **kwargs):
        self.name = self.goods.article + ' ' + self.goods.name
        super(GoodsDescription, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['goods__article', 'goods__name']

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
                'field': 'description',
                'type': 'string',
                'label': 'описание',
                'null': False,
            },
        ]


class PartsDescription(SettingsDictionary):
    """ parts name"""

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Parts Description'
        verbose_name_plural = 'Parts Descriptions'
        db_table_comment = 'parts description'
        db_table = 'parts_description'


class ArticleDescription(SettingsDictionary):
    """ print price"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    parts_description = models.ForeignKey(PartsDescription, on_delete=models.CASCADE)
    position = models.IntegerField()

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Article Description'
        verbose_name_plural = 'Article Descriptions'
        db_table_comment = 'article description'
        db_table = 'article_description'
        ordering = ['goods__article', 'goods__name']

    def save(self, *args, **kwargs):
        self.name = self.goods.article + ' ' + self.goods.name
        super(ArticleDescription, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['goods__article', 'goods__name']

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
                'field': 'parts_description',
                'type': 'foreign',
                'label': 'название детали',
                'null': False,
                'foreignClass': 'PartsDescription'
            },
            {
                'field': 'position',
                'type': 'number',
                'label': 'позиция',
                'null': False,
            },
        ]
