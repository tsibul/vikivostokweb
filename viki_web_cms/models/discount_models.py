from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.contrib.auth.models import Group


from viki_web_cms.models import SettingsDictionary


class StandardPriceType(SettingsDictionary):
    """ standard price type retail dealer etc. """
    priority = models.SmallIntegerField(default=10)
    group = models.ForeignKey(Group, on_delete=models.PROTECT, null=True, blank=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Тип цены'
        verbose_name_plural = 'Типы цен'
        db_table_comment = 'standard price type'
        db_table = 'standard_price_type'
        ordering = ['priority']

    @staticmethod
    def order_default():
        return ['priority']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'priority',
                'type': 'number',
                'label': 'приоритет',
                'null': False,
            },
            {
                'field': 'group',
                'type': 'foreign',
                'label': 'группа пользователей',
                'null': True,
                'foreignClass': 'Group'
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
        ordering = ['price_name__priority']

    def save(self, *args, **kwargs):
        self.name = self.price_name.name
        super(CustomerDiscount, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['price_name__priority']

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
                'type': 'precise',
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
        db_table_comment = 'Volume Discount'
        db_table = 'volume_discount'
        ordering = ['price_name__priority']

    def save(self, *args, **kwargs):
        self.name = self.price_name.name + ' ' + str(self.volume)
        super(VolumeDiscount, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['price_name__priority']

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
                'type': 'float',
                'label': 'доля от цены',
                'null': False,
            },
            {
                'field': 'volume',
                'type': 'number',
                'label': 'объем закупки',
                'null': False,
            },
        ]
