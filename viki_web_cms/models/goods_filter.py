from django.db import models

from viki_web_cms.models import SettingsDictionary


class GoodsFilter(SettingsDictionary):
    """ nearest color """
    multicolor = models.BooleanField(default=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Цветовая группа'
        verbose_name_plural = 'Цветовые группы'
        db_table_comment = 'nearest color'
        db_table = 'color_group'

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'hex',
                'type': 'string',
                'label': 'HEX',
                'null': False
            },
        ]
