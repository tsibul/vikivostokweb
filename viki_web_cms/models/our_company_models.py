from django.db import models

from viki_web_cms.models import SettingsDictionary


class OurCompany(SettingsDictionary):
    """ our company model """
    short_name = models.CharField(max_length=4)
    address = models.CharField(max_length=255)
    inn = models.CharField(max_length=12)
    kpp = models.CharField(max_length=9)
    ogrn = models.CharField(max_length=13)
    vat = models.BooleanField(default=False)
    priority = models.IntegerField()

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Наша компания'
        verbose_name_plural = 'Наши компании'
        db_table_comment = 'our companies'
        db_table = 'our_company'
        ordering = ['short_name']

    @staticmethod
    def order_default():
        return ['short_name']


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'short_name',
                'type': 'string',
                'label': 'код',
                'null': False,
            },
            {
                'field': 'inn',
                'type': 'string',
                'label': 'ИНН',
                'null': False,
            },
            {
                'field': 'kpp',
                'type': 'string',
                'label': 'КПП',
                'null': False,
            },
            {
                'field': 'ogrn',
                'type': 'string',
                'label': 'ОГРН',
                'null': False,
            },
            {
                'field': 'vat',
                'type': 'boolean',
                'label': 'НДС',
            },
            {
                'field': 'priority',
                'type': 'number',
                'label': 'приоритет',
                'null': False,
            },
            {
                'field': 'address',
                'type': 'textarea',
                'label': 'адрес',
                'null': False,
            },
        ]

class OurBank(SettingsDictionary):
    """ our bank model """
    short_name = models.CharField(max_length=4)
    bank_account = models.CharField(max_length=20)
    bic = models.CharField(max_length=9)
    corr_account = models.CharField(max_length=20)
    bank_city = models.CharField(max_length=120)
    priority = models.IntegerField()
    our_company = models.ForeignKey(OurCompany, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Наша банк'
        verbose_name_plural = 'Наши банки'
        db_table_comment = 'our banks'
        db_table = 'our_bank'
        ordering = ['short_name']


    @staticmethod
    def order_default():
        return ['short_name']


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'our_company',
                'type': 'foreign',
                'foreignClass': 'OurCompany',
                'label': 'код',
                'null': False,
            },
            {
                'field': 'short_name',
                'type': 'string',
                'label': 'код',
                'null': False,
            },
            {
                'field': 'bank_account',
                'type': 'string',
                'label': 'счет',
                'null': False,
            },
            {
                'field': 'bic',
                'type': 'string',
                'label': 'БИК',
                'null': False,
            },
            {
                'field': 'corr_account',
                'type': 'string',
                'label': 'корр. счет',
                'null': False,
            },
            {
                'field': 'bank_city',
                'type': 'string',
                'label': 'город',
                'null': False,
            },
            {
                'field': 'priority',
                'type': 'number',
                'label': 'приоритет',
                'null': False,
            },
        ]
