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
        return ['name']

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

    def get_delivery_options(self):
        """
        Get delivery options data for a specific object and current option.

        Args:
            obj: Object to get delivery options for

        Returns:
            dict: Dictionary containing current option and available options
        """
        # Get current option data
        current_option = {
            'id': self.id,
            'name': self.name,
            'price': self.price
        }

        # Get all available options except current
        available_options = list(
            DeliveryOption.objects.filter(deleted=False)
            .values('id', 'name', 'price')
        )

        return {
            'current_option': current_option,
            'available_options': available_options
        }

