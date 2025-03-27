from django.db import models

from viki_web_cms.models import SettingsDictionary


class PrintType(SettingsDictionary):
    """ print types """

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Print Type'
        verbose_name_plural = 'Тип нанесения'
        db_table_comment = 'Print type'
        db_table = 'print_type'


class PrintPlace(SettingsDictionary):
    """ print places """

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Print Place'
        verbose_name_plural = 'Место нанесения'
        db_table_comment = 'Print place'
        db_table = 'print_place'


class PrintVolume(SettingsDictionary):
    """ print volumes """
    quantity = models.IntegerField()
    print_type = models.ForeignKey(PrintType, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Print Volume'
        verbose_name_plural = 'Тиражи нанесения'
        db_table_comment = 'Print volume'
        db_table = 'print_volume'
        ordering = ['print_type', 'quantity']

    def save(self, *args, **kwargs):
        self.name = self.print_type.name + ' цена до ' + str(self.quantity)
        super(PrintVolume, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['print_type', 'quantity']

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
                'field': 'quantity',
                'type': 'number',
                'label': 'тираж',
                'null': False,
            },
            {
                'field': 'print_type',
                'type': 'foreign',
                'label': 'тип нанесения',
                'null': False,
                'foreignClass': 'PrintType',
            },
        ]


class PrintPriceGroup(SettingsDictionary):
    print_type = models.ForeignKey(PrintType, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Print Price Group'
        verbose_name_plural = 'Группы нанесения'
        db_table_comment = 'Print price group'
        db_table = 'print_price_group'
        ordering = ['print_type', 'name']

    @staticmethod
    def order_default():
        return ['print_type', 'name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'print_type',
                'type': 'foreign',
                'label': 'тип нанесения',
                'null': False,
                'foreignClass': 'PrintType',
            },
        ]
