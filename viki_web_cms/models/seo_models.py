from django.core.files.storage import FileSystemStorage
from django.db import models

from viki_web_cms.models import SettingsDictionary

fs_seo_photo = FileSystemStorage(location='static/viki_web_cms/files/og_images')

class SEO(SettingsDictionary):
    """
    Модель для SEO - используется как справочник для товаров и групп
    """

    # SEO поля
    title = models.CharField(
        max_length=70,
        blank=True,
        null=True,
        verbose_name='SEO заголовок',
        help_text='До 70 символов для Google'
    )
    description = models.CharField(
        max_length=160,
        blank=True,
        null=True,
        verbose_name='SEO описание',
        help_text='До 160 символов для сниппета'
    )
    keywords = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='Ключевые слова',
        help_text='Через запятую'
    )
    text = models.TextField(
        blank=True,
        null=True,
        verbose_name='SEO текст',
        help_text='Текст для индексации (отображается внизу страницы)'
    )

    # Open Graph
    og_title = models.CharField(max_length=95, blank=True, null=True, verbose_name='OG заголовок')
    og_description = models.CharField(max_length=200, blank=True, null=True, verbose_name='OG описание')
    og_image = models.ImageField(storage=fs_seo_photo, blank=True, null=True, verbose_name='OG изображение')

    # Технические
    canonical_url = models.URLField(blank=True, null=True, verbose_name='Канонический URL')
    noindex = models.BooleanField(default=False, verbose_name='Запретить индексацию')
    nofollow = models.BooleanField(default=False, verbose_name='Запретить следование по ссылкам')

    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'SEO'
        verbose_name_plural = 'SEO данные'
        db_table = 'seo'

    def __str__(self):
        return self.name

    @staticmethod
    def order_default():
        return ['title']

    @staticmethod
    def storage_url():
        return 'static/viki_web_cms/files/og_images'



    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'название',
                'null': False,
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'уд.',
            },
            {
                'field': 'title',
                'type': 'string',
                'label': 'SEO заголовок',
                'null': True,
            },
            {
                'field': 'description',
                'type': 'textarea',
                'label': 'SEO описание',
                'null': True,
            },
            {
                'field': 'keywords',
                'type': 'string',
                'label': 'ключевые слова',
                'null': True,
            },
            {
                'field': 'text',
                'type': 'textarea',
                'label': 'SEO текст',
                'null': True,
            },
            {
                'field': 'og_title',
                'type': 'string',
                'label': 'OG заголовок',
                'null': True,
            },
            {
                'field': 'og_description',
                'type': 'string',
                'label': 'OG описание',
                'null': True,
            },
            {
                'field': 'og_image',
                'type': 'file',
                'label': 'OG изображение',
                'null': True,
                'url': 'static/viki_web_cms/files/og_images',
            },
            {
                'field': 'og_image_photo',
                'property_off' : 'og_image',
                'type': 'image',
                'label': 'OG изображение',
                'null': True,
                'url': 'static/viki_web_cms/files/og_images',
            },
            {
                'field': 'canonical_url',
                'type': 'string',
                'label': 'канонический URL',
                'null': True,
            },
            {
                'field': 'noindex',
                'type': 'boolean',
                'label': 'noindex',
            },
            {
                'field': 'nofollow',
                'type': 'boolean',
                'label': 'nofollow',
            },
        ]