from django.db import models

from viki_web_cms.models import SettingsDictionary, Goods, GoodsGroup


class FilterOption(SettingsDictionary):
    """ filter names """

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Фильтр'
        verbose_name_plural = 'Фильтры'
        db_table_comment = 'Filter Options'
        db_table = 'filter_options'


class FilterToGoods(SettingsDictionary):
    """ goods filter set """
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    filter_option = models.ForeignKey(FilterOption, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Фильтр товара'
        verbose_name_plural = 'Фильтры товара'
        db_table_comment = 'Filter Goods'
        db_table = 'filter_goods'

    def save(self, *args, **kwargs):
        self.name = self.goods.name + self.filter_option.name
        super(FilterToGoods, self).save(*args, **kwargs)

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
                'foreignClass': 'Goods',
                'null': False
            },
            {
                'field': 'filter_option',
                'type': 'foreign',
                'label': 'фильтр',
                'foreignClass': 'FilterOption',
                'null': False
            },
        ]


class FilterToGoodsGroup(SettingsDictionary):
    """ goods group filter set """
    goods_group = models.ForeignKey(GoodsGroup, on_delete=models.CASCADE)
    filter_option = models.ForeignKey(FilterOption, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Фильтр группы товара'
        verbose_name_plural = 'Фильтры группы товара'
        db_table_comment = 'Filter Goods Group'
        db_table = 'filter_goods_group'

    def save(self, *args, **kwargs):
        self.name = self.goods_group.name + self.filter_option.name
        super(FilterToGoodsGroup, self).save(*args, **kwargs)

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
                'field': 'goods_group',
                'type': 'foreign',
                'label': 'товар',
                'foreignClass': 'GoodsGroup',
                'null': False
            },
            {
                'field': 'filter_option',
                'type': 'foreign',
                'label': 'фильтр',
                'foreignClass': 'FilterOption',
                'null': False
            },
        ]
