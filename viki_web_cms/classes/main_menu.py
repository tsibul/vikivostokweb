import json


class CMSSetting:
    def __init__(self, setting: str, setting_class):
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
            MainMenu("Настройки", str(json.dumps([

                MenuSection('Цвета, материалы', [
                    CMSSetting('Материал', 'MaterialType'),
                    CMSSetting('Цветовая Схема', 'ColorScheme'),
                    CMSSetting('Цвет', 'Color'),
                ]),
                MenuSection('Отображение', [
                    CMSSetting('Интерфейс товара', 'LayoutType'),
                ]),
                MenuSection('PANTONE-HEX', [
                    CMSSetting('PANTONE-HEX', 'PantoneToHex'),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True))),
            MainMenu('Номенклатура', '[]'),
            MainMenu('Менеджеры', '[]'),
            MainMenu('Клиенты', '[]'),
            MainMenu('Заказы', '[]'),
        ]
        return menu_list
