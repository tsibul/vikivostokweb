import json

class CMSSetting:
    def __init__(self, setting: str, setting_class: str, upload: bool, new: bool):
        self.setting = setting
        self.setting_class = setting_class
        self.upload = upload
        self.new = new

    @staticmethod
    def cms_set(setting):
        return


class MenuSection:
    def __init__(self, section_name: str, cms_settings: list[CMSSetting]):
        self.section_name = section_name
        self.cms_settings = cms_settings


class MainMenu:
    def __init__(self, name: str, item: str, page_type: str):
        self.name = name
        self.item = item
        self.page_type = page_type

    @staticmethod
    def menu_set():
        menu_list = [
            MainMenu("Настройки", str(json.dumps([

                MenuSection('Цвета, материалы', [
                    CMSSetting('Материал', 'MaterialType', False, False),
                    CMSSetting('Цветовая Схема', 'ColorScheme', False, False),
                    CMSSetting('Цветовая Группа', 'ColorGroup', False, False ),
                    CMSSetting('Цвет', 'Color', True, False ),
                ]),
                MenuSection('Настройки товаров', [
                    CMSSetting('Группы каталога', 'ProductGroup', False, True ),
                    CMSSetting('Группы товара', 'GoodsGroup', False, False ),
                    CMSSetting('Опции товара', 'GoodsOption', False, False),
                    CMSSetting('Группы опций товара', 'GoodsOptionGroup', False, False ),
                    CMSSetting('Похожие товары', 'GoodsSimilar', False, False),
                    CMSSetting('Сопутствующие товары', 'GoodsRelated', False, False),
                ]),
                MenuSection('Описания', [
                    CMSSetting('Описание товаров', 'GoodsDescription', False, False),
                    CMSSetting('Названия деталей', 'PartsDescription', False, False ),
                    CMSSetting('Структура артикула', 'ArticleDescription', False, False ),
                ]),
                MenuSection('Виды цен и скидки', [
                    CMSSetting('Прайс листы', 'Price', False, False),
                    CMSSetting('Виды цен', 'StandardPriceType', False, False ),
                    CMSSetting('Скидки для клиента', 'CustomerDiscount', False, False ),
                    CMSSetting('Скидки от объема', 'VolumeDiscount', False, False ),
                    CMSSetting('Градация количества товара', 'PriceGoodsQuantity', False, False ),
                ]),
                MenuSection('Техническая информация', [
                    CMSSetting('Размеры деталей', 'GoodsDimensions', True, False),
                    CMSSetting('Параметры нанесения', 'PrintData', False, False ),
                    CMSSetting('Возможности нанесения', 'PrintOpportunity', False, False ),
                    CMSSetting('Список шаблонов', 'PrintLayout', False, False ),
                    CMSSetting('Шаблоны для товара', 'GoodsLayout', False, False ),
                ]),
                MenuSection('Фото товаров', [
                    CMSSetting('Доп. фото товаров', 'CatalogueItemPhoto', False, False),
                ]),
                MenuSection('Отображение', [
                    CMSSetting('Интерфейс товара', 'LayoutType', False, False),
                ]),
                MenuSection('Нанесение', [
                    CMSSetting('Тип нанесения', 'PrintType', False, False),
                    CMSSetting('Место нанесения', 'PrintPlace', False, False ),
                    CMSSetting('Тиражи нанесения', 'PrintVolume', False, False ),
                    CMSSetting('Ценовые группы нанесения', 'PrintPriceGroup', False, False ),
                    CMSSetting('Товары в ценовых группах', 'PrintGroupToGoods', False, False ),
                ]),
                MenuSection('Фильтры', [
                    CMSSetting('Фильтры', 'FilterOption', False, False),
                    CMSSetting('Фильтры товаров', 'FilterToGoods', False, False ),
                    CMSSetting('Фильтры групп товаров', 'FilterToGoodsGroup', False, False ),
                ]),
                MenuSection('Упаковка', [
                    CMSSetting('Гофрокороб', 'Box', False, False),
                    CMSSetting('Упаковка товара', 'Packing', False, False ),
                ]),
                MenuSection('PANTONE-HEX', [
                    CMSSetting('PANTONE-HEX', 'PantoneToHex', True, False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Standard'),
            MainMenu('Номенклатура', str(json.dumps([
                MenuSection('Номенклатура', [
                    CMSSetting('Товары/артикулы', 'Goods', True, True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Goods'),
            MainMenu('Каталог', str(json.dumps([
                MenuSection('Каталог', [
                    CMSSetting('Каталог', 'Catalogue', True, True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Catalogue'),
            MainMenu('Прайс-лист', str(json.dumps([
                MenuSection('Прайс-лист', [
                    CMSSetting('Прайс-лист от', 'Price', False, False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'PriceList'),
            MainMenu('Файлы', str(json.dumps([
                MenuSection('Файлы', [
                    CMSSetting('Неиспользуемые файлы', 'Files', False, False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Files'),
        ]
        return menu_list
