from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from viki_web_cms.models import SettingsDictionary


class StandardPriceType(SettingsDictionary):
    """ standard price type retail dealer etc. """
    field_name = models.CharField(max_length=120, null=False, blank=False, unique=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Тип цены'
        verbose_name_plural = 'Типы цен'
        db_table_comment = 'standard price type'
        db_table = 'standard_price_type'

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'field_name',
                'type': 'string',
                'label': 'название поля',
                'null': False
            },
        ]

class CustomerDiscount(SettingsDictionary):
    """ discounts on standard price """
    price_name = models.ForeignKey(StandardPriceType, on_delete=models.CASCADE, unique=True)
    discount = models.FloatField(null=False, blank=False, validators=[MaxValueValidator(1), MinValueValidator(0)])

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Скидка партнера'
        verbose_name_plural = 'Скидки партнеров'
        db_table_comment = 'customer discount'
        db_table = 'customer_discount'

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'price_name',
                'type': 'foreign',
                'label': 'клиент',
                'null': False,
                'foreignClass': 'StandardPriceType',
            },
            {
                'field': 'discount',
                'type': 'number',
                'label': 'доля от конечника',
                'null': False,
            },
        ]

class VolumeDiscount(SettingsDictionary):
    """ discounts on volume """
    price_name = models.ForeignKey(StandardPriceType, on_delete=models.CASCADE)
    discount = models.FloatField(null=False, blank=False, validators=[MaxValueValidator(1), MinValueValidator(0)])
    volume = models.IntegerField(null=False, blank=False)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Скидка партнера'
        verbose_name_plural = 'Скидки партнеров'
        db_table_comment = 'price discount'
        db_table = 'price_discount'

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'price_name',
                'type': 'foreign',
                'label': 'клиент',
                'null': False,
                'foreignClass': 'StandardPriceType',
            },
            {
                'field': 'discount',
                'type': 'number',
                'label': 'доля от конечника',
                'null': False,
            },
            {
                'field': 'volume',
                'type': 'number',
                'label': 'объем закупки',
                'null': False,
            },
        ]
