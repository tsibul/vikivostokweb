from django.contrib.auth.models import User
from django.db import models

from viki_web_cms.functions.dadata_parse_inn import dadata_parse_inn
from viki_web_cms.models import SettingsDictionary, StandardPriceType
from viki_web.functions.field_validation import bic_validation


class Customer(SettingsDictionary):
    """ customer group """
    e_mail_alias = models.CharField(max_length=255, null=True, blank=True)
    standard_price_type = models.ForeignKey(StandardPriceType, on_delete=models.SET_NULL, null=True, blank=True)
    new = models.BooleanField(default=True)
    # vat = models.BooleanField(default=False)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Клиент (группа)'
        verbose_name_plural = 'Клиенты'
        db_table_comment = 'Customer'
        db_table = 'customer'

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'e_mail_alias',
                'type': 'string',
                'label': 'сайт',
                'null': True,
            },
            {
                'field': 'standard_price_type',
                'type': 'foreign',
                'label': 'прайс-лист',
                'foreignClass': 'StandardPriceType',
                'null': True,
            },
            {
                'field': 'new',
                'type': 'boolean',
                'label': 'новый',
            },
            # {
            #     'field': 'vat',
            #     'type': 'boolean',
            #     'label': 'с НДС',
            # },
            {
                'field': 'manager',
                'type': 'foreign',
                'label': 'менеджер',
                'foreignClass': 'User',
                'null': True,
            },

        ]


class Company(SettingsDictionary):
    """ company """
    legal = models.BooleanField(default=True)
    inn = models.CharField(max_length=12, null=False, blank=False)
    kpp = models.CharField(max_length=9, null=True, blank=True)
    ogrn = models.CharField(max_length=13, null=True, blank=True)
    region = models.CharField(max_length=2)
    address = models.CharField(max_length=255, null=False, blank=False)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    vat = models.BooleanField(default=False)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Клиент (группа)'
        verbose_name_plural = 'Клиенты'
        db_table_comment = 'Company'
        db_table = 'company'

    def save(self, *args, **kwargs):
        result = dadata_parse_inn(self.inn)
        if result['errors']:
            return result
        else:
            company_data = result['result']
            self.name = company_data['value']
            if not self.customer_id:
                short_name = company_data['data']['name']['full']
                price_type = StandardPriceType.objects.all().order_by('priority')[0]
                self.customer = Customer.objects.create(
                    name=short_name,
                    standard_price_type=price_type)
            self.kpp = company_data['data']['kpp']
            self.ogrn = company_data['data']['ogrn']
            self.address = company_data['data']['address']['unrestricted_value']
            self.region = self.kpp[0:2]
            super(Company, self).save(*args, **kwargs)
            return self

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
                'label': 'уд.',
            },
            {
                'field': 'legal',
                'type': 'boolean',
                'label': 'юр. лицо',
            },
            {
                'field': 'inn',
                'type': 'string',
                'label': 'ИНН',
                'null': False,
            },
            # {
            #     'field': 'kpp',
            #     'type': 'string',
            #     'label': 'КПП',
            #     'null': True,
            # },
            # {
            #     'field': 'ogrn',
            #     'type': 'string',
            #     'label': 'ОГРН',
            #     'null': True,
            # },
            {
                'field': 'region',
                'type': 'string',
                'label': 'регион',
                'null': True,
            },
            {
                'field': 'customer',
                'type': 'foreign',
                'label': 'клиент',
                'foreignClass': 'Customer',
                'null': True,
            },
            {
                'field': 'address',
                'type': 'textarea',
                'label': 'адрес',
                'null': True,
            },
            {
                'field': 'vat',
                'type': 'boolean',
                'label': 'с НДС',
            },
        ]


class BankAccount(SettingsDictionary):
    """ company account """
    account_no = models.CharField(max_length=20, null=False, blank=False)
    bic = models.CharField(max_length=9, null=False, blank=False)
    corr_account = models.CharField(max_length=20, null=False, blank=False)
    city = models.CharField(max_length=140, null=False, blank=False)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Банковский счет'
        verbose_name_plural = 'Банковские счета'
        db_table_comment = 'BankAccount'
        db_table = 'bank_account'

    def save(self, *args, **kwargs):
        validation_result = bic_validation(self.bic)
        if not validation_result:
            return {'errors': ['bic'], 'status': 'error', 'message': 'Неверный формат БИК или банк не найден'}

        self.name = validation_result['name']
        self.corr_account = validation_result['corr_account']
        self.city = validation_result['city']
        super(BankAccount, self).save(*args, **kwargs)

    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'банк',
                'null': True,
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'уд.',
            },
            {
                'field': 'account_no',
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
            # {
            #     'field': 'corr_account',
            #     'type': 'string',
            #     'label': 'кор. счет',
            #     'null': True,
            # },
            # {
            #     'field': 'city',
            #     'type': 'string',
            #     'label': 'город',
            #     'null': True,
            # },
            {
                'field': 'company',
                'type': 'foreign',
                'label': 'компания',
                'foreignClass': 'Company',
                'null': False,
            },
        ]
