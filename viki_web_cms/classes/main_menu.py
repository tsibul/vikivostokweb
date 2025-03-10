import json

class CMSSetting:
    def __init__(self, setting: str, setting_class: str, upload: bool):
        self.setting = setting
        self.setting_class = setting_class
        self.upload = upload

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
            MainMenu('Номенклатура', str(json.dumps([
                MenuSection('Номенклатура', [
                    CMSSetting('Товары/артикулы', 'Goods', True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Goods'),
            MainMenu('Каталог', str(json.dumps([
                MenuSection('Каталог', [
                    CMSSetting('Каталог', 'Catalogue', True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Catalogue'),
            MainMenu('Прайс-лист', str(json.dumps([
                MenuSection('Прайс-лист', [
                    CMSSetting('Прайс-лист от', 'Price', False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'PriceList'),
            MainMenu("Настройки", str(json.dumps([

                MenuSection('Цвета, материалы', [
                    CMSSetting('Материал', 'MaterialType', False),
                    CMSSetting('Цветовая Схема', 'ColorScheme', False),
                    CMSSetting('Цветовая Группа', 'ColorGroup', False ),
                    CMSSetting('Цвет', 'Color', True ),
                ]),
                MenuSection('Настройки товаров', [
                    CMSSetting('Группы каталога', 'ProductGroup', False ),
                    CMSSetting('Группы товара', 'GoodsGroup', False ),
                    CMSSetting('Опции товара', 'GoodsOption', False),
                    CMSSetting('Группы опций товара', 'GoodsOptionGroup', False ),
                ]),
                MenuSection('Виды цен и скидки', [
                    CMSSetting('Прайс листы', 'Price', False),
                    CMSSetting('Виды цен', 'StandardPriceType', False ),
                    CMSSetting('Скидки для клиента', 'CustomerDiscount', False ),
                    CMSSetting('Скидки от объема', 'VolumeDiscount', False),
                    CMSSetting('Градация количества товара', 'PriceGoodsQuantity', False),
                ]),
                MenuSection('Фото товаров', [
                    CMSSetting('Фото товаров', '', True),
                ]),
                MenuSection('Отображение', [
                    CMSSetting('Интерфейс товара', 'LayoutType', False),
                ]),
                MenuSection('Нанесение', [
                    CMSSetting('Тип нанесения', 'PrintType', False),
                    CMSSetting('Место нанесения', 'PrintPlace', False),
                    CMSSetting('Тиражи нанесения', 'PrintVolume', False),
                    CMSSetting('Ценовые группы нанесения', 'PrintPriceGroup', False),
                    CMSSetting('Товары в ценовых группах', 'PrintGroupToGoods', False),
                ]),
                MenuSection('Фильтры', [
                    CMSSetting('Фильтры', 'FilterOption', False),
                    CMSSetting('Фильтры товаров', 'FilterToGoods', False),
                    CMSSetting('Фильтры групп товаров', 'FilterToGoodsGroup', False),
                ]),
                MenuSection('PANTONE-HEX', [
                    CMSSetting('PANTONE-HEX', 'PantoneToHex', True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Standard'),
        #     MainMenu('Менеджеры', str(json.dumps([
        #         MenuSection('Менеджеры', [
        #         ]),
        #     ], default=lambda o: o.__dict__,
        #         sort_keys=True))),
        #     MainMenu('Клиенты', str(json.dumps([
        #         MenuSection('Клиенты', [
        #         ]),
        #     ], default=lambda o: o.__dict__,
        #         sort_keys=True))),
        #     MainMenu('Заказы', str(json.dumps([
        #         MenuSection('Заказы', [
        #         ]),
        #     ], default=lambda o: o.__dict__,
        #         sort_keys=True))),
        ]
        return menu_list
