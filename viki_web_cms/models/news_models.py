from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import SettingsDictionary

fs_news = FileSystemStorage(location='static/viki_web_cms/files/news')


class News(SettingsDictionary):
    """ navigation sections"""
    main_text = models.CharField(max_length=400, blank=True, null=True)
    second_text = models.CharField(max_length=400, blank=True, null=True)
    image = models.FileField(storage=fs_news, blank=True, null=True)
    date = models.DateField()

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        db_table_comment = 'news'
        db_table = 'news'
        ordering = ['-date']


    @property
    def file_url(self):
        return f"/static/viki_web_cms/files/news/{self.image.name}" if self.image else None

    @staticmethod
    def storage_url():
        return '/static/viki_web_cms/files/news/'

    @staticmethod
    def order_default():
        return ['-date']


    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'date',
                'type': 'date',
                'label': 'дата',
                'null': False,
            },
            {
                'field': 'main_text',
                'type': 'textarea',
                'label': 'новость',
                'null': False,
            },
            {
                'field': 'second_text',
                'type': 'textarea',
                'label': 'доп текст',
                'null': False,
            },
            {
                'field': 'priority',
                'type': 'number',
                'label': 'приоритет показа',
                'null': False,
            },
            {
                'field': 'image',
                'type': 'file',
                'label': 'обложка',
                'url': '/static/viki_web_cms/files/news/',
                'null': True,
            },
            {
                'field': 'image_photo',
                'property_off' : 'image',
                'type': 'image',
                'label': 'обложка',
                'url': '/static/viki_web_cms/files/news/',
                'null': True,
            },
        ]
