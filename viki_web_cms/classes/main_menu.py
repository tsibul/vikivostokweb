import json


class CMSSetting:
    def __init__(self, setting: str, setting_class: str):
        self.setting = setting
        self.setting_class = setting_class

    @staticmethod
    def cms_set(setting):
        return


class MenuSection:
    def __init__(self, section_name: str, cms_settings: list[CMSSetting]):
        self.section_name = section_name
        self.cms_settings = cms_settings


class MainMenu:
    def __init__(self, name: str, item: str):
        self.name = name
        self.item = item

    @staticmethod
    def menu_set():
        menu_list = [
            MainMenu('Номенклатура', str(json.dumps([
                MenuSection('Номенклатура', [
                    CMSSetting('Товары/артикулы', 'Goods'),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True))),
            MainMenu('Каталог', str(json.dumps([
                MenuSection('Каталог', [
                    CMSSetting('Каталог', ''),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True))),
            MainMenu('Прайс-лист', str(json.dumps([
                MenuSection('Прайс-лист', [
                    CMSSetting('Прайс-лист', ''),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True))),
            MainMenu("Настройки", str(json.dumps([

                MenuSection('Цвета, материалы', [
                    CMSSetting('Материал', 'MaterialType'),
                    CMSSetting('Цветовая Схема', 'ColorScheme'),
                    CMSSetting('Цветовая Группа', 'ColorGroup' ),
                    CMSSetting('Цвет', 'Color' ),
                ]),
                MenuSection('Настройки товаров', [
                    CMSSetting('Группы каталога', 'ProductGroup' ),
                    CMSSetting('Группы товара', 'GoodsGroup' ),
                    CMSSetting('Опции товара', 'GoodsOption'),
                    CMSSetting('Связь товаров и опций', 'GoodsToOption'),
                ]),
                MenuSection('Фото товаров', [
                    CMSSetting('Фото товаров', ''),
                ]),
                MenuSection('Отображение', [
                    CMSSetting('Интерфейс товара', 'LayoutType'),
                ]),
                MenuSection('Нанесение', [
                    CMSSetting('Тип нанесения', ''),
                    CMSSetting('Место нанесения', ''),
                ]),
                MenuSection('Дополнительные фильтры', [
                    CMSSetting('Фильтры', ''),
                    CMSSetting('Фильтры', ''),
                ]),
                MenuSection('PANTONE-HEX', [
                    CMSSetting('PANTONE-HEX', 'PantoneToHex'),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True))),
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
