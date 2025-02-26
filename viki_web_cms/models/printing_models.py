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
