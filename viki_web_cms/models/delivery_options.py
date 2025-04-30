from django.db import models

from viki_web_cms.models import SettingsDictionary



class DeliveryOption(SettingsDictionary):
    """ navigation sections"""
    price = models.IntegerField()

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Опция доставки'
        verbose_name_plural = 'Опции доставки'
        db_table_comment = 'delivery options'
        db_table = 'delivery_options'
        ordering = ['name']

    @staticmethod
    def order_default():
        return ['priority']


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'price',
                'type': 'number',
                'label': 'стоимость',
                'null': True,
            },
        ]
