from django.core.files.storage import FileSystemStorage
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from viki_web_cms.models import Goods, SettingsDictionary, Color, GoodsOption

fs_item_photo = FileSystemStorage(location='static/viki_web_cms/files/item_photo')
fs_item_add_photo = FileSystemStorage(location='static/viki_web_cms/files/item_add_photo')


class CatalogueItem(SettingsDictionary):
    """ catalogue item """
    item_article = models.CharField(max_length=120)
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    main_color = models.ForeignKey(Color, on_delete=models.CASCADE)
    image = models.FileField(storage=fs_item_photo, null=True, blank=True)
    simple_article = models.BooleanField(default=True)
    goods_option = models.ForeignKey(GoodsOption, on_delete=models.SET_NULL, null=True, blank=True)
    new = models.BooleanField(default=False)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Позиция каталога'
        verbose_name_plural = 'Позиции каталога'
        db_table_comment = 'Catalogue Item'
        db_table = 'catalogue_item'
        ordering = ['goods__article', 'goods__name', 'main_color__code']

    @staticmethod
    def order_default():
        return ['goods__article', 'goods__name', 'main_color__code']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'item_article',
                'type': 'string',
                'label': 'артикул',
                'null': False,
            },
            {
                'field': 'goods',
                'type': 'foreign',
                'label': 'номенклатура',
                'foreignClass': 'Goods',
                'null': False,
            },
            {
                'field': 'main_color',
                'type': 'foreign',
                'label': 'осн. цвет',
                'foreignClass': 'Color',
                'null': False,
            },
            {
                'field': 'image',
                'type': 'img',
                'label': 'фото',
                'url': '/static/viki_web_cms/files/item_photo/',
                'null': True,
            },
            {
                'field': 'new',
                'type': 'boolean',
                'label': 'новый',
            },
            {
                'field': 'simple_article',
                'type': 'boolean',
                'label': 'простой артикул',
            },
            {
                'field': 'goods_option',
                'type': 'foreign',
                'label': 'опция',
                'foreignClass': 'GoodsOption',
                'null': False,
            },
        ]


class CatalogueItemColor(SettingsDictionary):
    """ catalogue item  color"""
    color_position = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(9)])
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Дополнительный цвет'
        verbose_name_plural = 'Дополнительные цвета'
        db_table_comment = 'Catalogue Item Color'
        db_table = 'catalogue_item_color'
        ordering = ['item__goods__article', 'item__goods__name']

    @staticmethod
    def order_default():
        return ['item__goods__article', 'item__goods__name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'color_position',
                'type': 'number',
                'label': 'позиция',
                'null': False,
            },
            {
                'field': 'color',
                'type': 'foreign',
                'label': 'цвет',
                'foreignClass': 'Color',
                'null': False,
            },
            {
                'field': 'item',
                'type': 'foreign',
                'label': 'товар',
                'foreignClass': 'CatalogueItem',
                'null': False,
            },
        ]


class CatalogueItemPhoto(SettingsDictionary):
    """ catalogue item  color"""
    # color_position = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(9)])
    add_photo = models.FileField(storage=fs_item_add_photo, null=True, blank=True)
    item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Дополнительное фото'
        verbose_name_plural = 'Дополнительные фото'
        db_table_comment = 'Catalogue Item Photo'
        db_table = 'catalogue_item_photo'
        ordering = ['item__item_article']

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.item.item_article
        super(CatalogueItemPhoto, self).save(*args, **kwargs)

    @staticmethod
    def order_default():
        return ['item__item_article']

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
                'field': 'item',
                'type': 'foreign',
                'label': 'товар',
                'foreignClass': 'CatalogueItem',
                'null': False,
            },
            {
                'field': 'add_photo',
                'type': 'file',
                'label': 'фото',
                'null': False,
            },
        ]

# class CatalogueItemOption(SettingsDictionary):
#     """ catalogue item  option"""
#     option = models.ForeignKey(GoodsOption, on_delete=models.CASCADE)
#     item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE)
#
#     class Meta(SettingsDictionary.Meta):
#         verbose_name = 'Опция позиции каталога'
#         verbose_name_plural = 'Опции позиций каталога'
#         db_table_comment = 'Catalogue Item Option'
#         db_table = 'catalogue_item_option'
#         ordering = ['item__goods__article', 'item__goods__name']
#
#     @staticmethod
#     def order_default():
#         return ['item__goods__article', 'item__goods__name']
#
#     @staticmethod
#     def dictionary_fields():
#         return SettingsDictionary.dictionary_fields() + [
#             {
#                 'field': 'option',
#                 'type': 'foreign',
#                 'label': 'цвет',
#                 'foreignClass': 'GoodsOption',
#                 'null': False,
#             },
#             {
#                 'field': 'item',
#                 'type': 'foreign',
#                 'label': 'товар',
#                 'foreignClass': 'CatalogueItem',
#                 'null': False,
#             },
#         ]
