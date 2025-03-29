import configparser
import requests

import json

from django.contrib.sites import requests
from django.db import models
from dadata import Dadata

from viki_web_cms.models import SettingsDictionary, StandardPriceType


class Customer(SettingsDictionary):
    """ customer group """
    e_mail_alias = models.CharField(max_length=255, null=True, blank=True)
    standard_price_type = models.ForeignKey(StandardPriceType, on_delete=models.SET_NULL, null=True, blank=True)

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
                'label': 'тип материала',
                'foreignClass': 'StandardPriceType',
                'null': True,
            },
        ]


class Company(SettingsDictionary):
    """ company """
    legal = models.BooleanField(default=True)
    inn = models.CharField(max_length=12, null=False, blank=False)
    kpp = models.CharField(max_length=8)
    ogrn = models.CharField(max_length=13)
    region = models.CharField(max_length=2)
    address = models.CharField(max_length=255, null=False, blank=False)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)


    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Клиент (группа)'
        verbose_name_plural = 'Клиенты'
        db_table_comment = 'Company'
        db_table = 'company'

    def save(self, *args, **kwargs):
        config = configparser.RawConfigParser()
        config.read('config.cfg')
        config_dict = dict(config.items('LOG_PAS'))
        token = config_dict['dadata_token']
        dadata = Dadata(token)
        result = dadata.suggest('party', self.inn)
        company_data = result[0]
        self.name = company_data['value']
        self.kpp = company_data['kpp']
        self.ogrn = company_data['ogrn']
        self.address = company_data['address']['unrestricted_value']
        self.region = self.kpp[0:2]
        super(Company, self).save(*args, **kwargs)


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
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
            {
                'field': 'kpp',
                'type': 'string',
                'label': 'КПП',
                'null': True,
            },
            {
                'field': 'ogrn',
                'type': 'string',
                'label': 'ОГРН',
                'null': True,
            },
            {
                'field': 'region',
                'type': 'string',
                'label': 'регион',
                'null': True,
            },
            {
                'field': 'address',
                'type': 'textarea',
                'label': 'адрес',
                'null': False,
            },
            {
                'field': 'customer',
                'type': 'foreign',
                'label': 'тип материала',
                'foreignClass': 'Customer',
                'null': True,
            },
        ]

class BankAccount(SettingsDictionary):
    """ company account """
    account_no = models.CharField(max_length=20, null=False, blank=False)
    bic = models.CharField(max_length=9, null=False, blank=False)
    corr_account = models.CharField(max_length=20, null=False, blank=False)
    bank_name = models.CharField(max_length=140, null=False, blank=False)
    city = models.CharField(max_length=140, null=False, blank=False)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)


    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Банковский счет'
        verbose_name_plural = 'Банковские счета'
        db_table_comment = 'BankAccount'
        db_table = 'bank_account'

    def save(self, *args, **kwargs):
        url = f"https://bik-info.ru/api.html?type=json&bik={self.bic}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            self.corr_account = data['ks']
            self.bank_name = data['name']
            self.city = data['city']
            super(BankAccount, self).save(*args, **kwargs)


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
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
            {
                'field': 'corr_account',
                'type': 'string',
                'label': 'кор. счет',
                'null': False,
            },
            {
                'field': 'bank_name',
                'type': 'string',
                'label': 'банк',
                'null': False,
            },
            {
                'field': 'city',
                'type': 'string',
                'label': 'город',
                'null': False,
            },
            {
                'field': 'company',
                'type': 'foreign',
                'label': 'компания',
                'foreignClass': 'Company',
                'null': False,
            },
        ]

