from viki_web_cms.models import SettingsDictionary


class LayoutType(SettingsDictionary):
    """ catalogue page layout types """

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Catalogue Page Layout Type'
        verbose_name_plural = 'Тип макета страницы каталога'
        db_table_comment = 'Layout type'
        db_table = 'layout_type'

