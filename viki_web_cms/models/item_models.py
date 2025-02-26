from zipfile import error

from django.core.files.storage import FileSystemStorage
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.template.defaultfilters import length

from viki_web_cms.models import Goods, SettingsDictionary, Color, GoodsToOption, GoodsOption

fs_item_photo = FileSystemStorage(location='viki_web_cms/files/item_photo')


class CatalogueItem(SettingsDictionary):
    """ catalogue item """
    item_article = models.CharField(max_length=120)
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE)
    main_color = models.ForeignKey(Color, on_delete=models.CASCADE)
    image = models.FileField(upload_to=fs_item_photo, storage=fs_item_photo, null=True, blank=True)
    simple_article = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        image_name = self.image.name.split('.')[0]
        goods_article = self.goods.article
        self.name = self.goods.name
        option_length = 1 if GoodsToOption.objects.filter(goods=self.goods).exists() else 0
        if self.simple_article:
            color_article_str = image_name.removeprefix(goods_article)
            if not (
                    length(image_name) - length(goods_article) == length(color_article_str) or
                    length(color_article_str) == self.goods.details_number * 2 + option_length
            ):
                return {'error': True}
            color_article = [color_article_str[i:i + 2] for i in range(0, len(color_article_str) - option_length, 2)]
            if option_length:
                color_article.append(color_article_str[-1:])
        else:
            color_article = image_name.split('#')[1:]
            if not (
                    image_name.split('#')[0] == goods_article and
                    length(color_article) == self.goods.details_number + option_length
            ):
                return {'error': True}
        self.main_color = Color.objects.filter(color_scheme=self.goods.color_scheme, code=color_article[0]).first()
        self.name = self.name + ' ' + self.main_color.name
        self.item_article = goods_article + '.' + '.'.join(color_article)
        item_option = CatalogueItemOption.objects.filter(item=self).first()
        colors_to_save = []
        if self.goods.multicolor or self.goods.additional_material:
            additional_colors = CatalogueItemColor.objects.filter(item=self)
            for i in range(1, self.goods.details_number + 1):
                if not self.goods.additional_material and i < self.goods.details_number:
                    current_color = Color.objects.filter(color_scheme=self.goods.color_scheme,
                                                         code=color_article[i]).first()
                else:
                    current_color = Color.objects.filter(color_scheme=self.goods.additional_color_scheme,
                                                         code=color_article[i]).first()
                if additional_colors:
                    additional_color = additional_colors.filter(color_position=i + 1).first()
                    additional_color.color = current_color
                else:
                    additional_color = CatalogueItemColor(item=self, color=current_color, color_position=i + 1)
                self.name = self.name + '/' + additional_color.name
                colors_to_save.append(additional_color)
        if option_length:
            new_option = GoodsOption.objects.get(option_article=color_article[-1])
            if item_option:
                item_option.option = new_option
            else:
                item_option = CatalogueItemOption(item=self, option=new_option)
            self.name = self.name + '/' + item_option.name
        super(CatalogueItem, self).save(*args, **kwargs)
        item_option.save()
        if colors_to_save:
            for color in colors_to_save:
                color.save()
        return {
            'name': self.name,
            'item_article': self.item_article,
            'goods': self.goods.name,
            'main_color': self.main_color.code + ' ' + self.main_color.name,
            'simple_article': self.simple_article,
            'image': self.image.name if self.image else None,
            'image_url': self.image.url if self.image else None,
        }

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
                'field': 'simple_article',
                'type': 'boolean',
                'label': 'простой артикул',
            }
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


class CatalogueItemOption(SettingsDictionary):
    """ catalogue item  option"""
    option = models.ForeignKey(GoodsOption, on_delete=models.CASCADE)
    item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE)

    class Meta(SettingsDictionary.Meta):
        verbose_name = 'Опция позиции каталога'
        verbose_name_plural = 'Опции позиций каталога'
        db_table_comment = 'Catalogue Item Option'
        db_table = 'catalogue_item_option'
        ordering = ['item__goods__article', 'item__goods__name']

    @staticmethod
    def order_default():
        return ['item__goods__article', 'item__goods__name']

    @staticmethod
    def dictionary_fields():
        return SettingsDictionary.dictionary_fields() + [
            {
                'field': 'option',
                'type': 'foreign',
                'label': 'цвет',
                'foreignClass': 'GoodsOption',
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
