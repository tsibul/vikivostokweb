import json

class CustomerSetting:
    def __init__(self, setting: str, setting_class: str, upload: bool):
        self.setting = setting
        self.setting_class = setting_class
        self.upload = upload

    @staticmethod
    def cms_set(setting):
        return


class CustomerSection:
    def __init__(self, section_name: str, cms_settings: list[CustomerSetting]):
        self.section_name = section_name
        self.cms_settings = cms_settings


class CustomerMenu:
    def __init__(self, name: str, item: str, page_type: str):
        self.name = name
        self.item = item
        self.page_type = page_type

    @staticmethod
    def menu_set():
        menu_list = [
            CustomerMenu("Настройки", str(json.dumps([

                CustomerSection('Цвета, материалы', [
                    CustomerSetting('Материал', 'MaterialType', False),
                    CustomerSetting('Цветовая Схема', 'ColorScheme', False),
                    CustomerSetting('Цветовая Группа', 'ColorGroup', False),
                ]),
                CustomerSection('Настройки товаров', [
                    CustomerSetting('Группы каталога', 'ProductGroup', False),
                    CustomerSetting('Группы товара', 'GoodsGroup', False),
                    CustomerSetting('Опции товара', 'GoodsOption', False),
                    CustomerSetting('Группы опций товара', 'GoodsOptionGroup', False),
                ]),
                CustomerSection('Описания', [
                    CustomerSetting('Описание товаров', 'GoodsDescription', False),
                    CustomerSetting('Названия деталей', 'PartsDescription', False),
                    CustomerSetting('Структура артикула', 'ArticleDescription', False),
                ]),
                CustomerSection('Виды цен и скидки', [
                    CustomerSetting('Прайс листы', 'Price', False),
                    CustomerSetting('Виды цен', 'StandardPriceType', False),
                    CustomerSetting('Скидки для клиента', 'CustomerDiscount', False),
                    CustomerSetting('Скидки от объема', 'VolumeDiscount', False),
                    CustomerSetting('Градация количества товара', 'PriceGoodsQuantity', False),
                ]),
                CustomerSection('Техническая информация', [
                    CustomerSetting('Размеры деталей', 'GoodsDimensions', True),
                    CustomerSetting('Параметры нанесения', 'PrintData', False),
                    CustomerSetting('Возможности нанесения', 'PrintOpportunity', False),
                    CustomerSetting('Список шаблонов', 'PrintLayout', False),
                    CustomerSetting('Шаблоны для товара', 'GoodsLayout', False),
                ]),
                CustomerSection('Отображение', [
                    CustomerSetting('Интерфейс товара', 'LayoutType', False),
                ]),
                CustomerSection('Нанесение', [
                    CustomerSetting('Тип нанесения', 'PrintType', False),
                    CustomerSetting('Место нанесения', 'PrintPlace', False),
                    CustomerSetting('Тиражи нанесения', 'PrintVolume', False),
                    CustomerSetting('Ценовые группы нанесения', 'PrintPriceGroup', False),
                    CustomerSetting('Товары в ценовых группах', 'PrintGroupToGoods', False),
                ]),
                CustomerSection('Фильтры', [
                    CustomerSetting('Фильтры', 'FilterOption', False),
                    CustomerSetting('Фильтры товаров', 'FilterToGoods', False),
                    CustomerSetting('Фильтры групп товаров', 'FilterToGoodsGroup', False),
                ]),
                CustomerSection('Упаковка', [
                    CustomerSetting('Гофрокороб', 'Box', False),
                    CustomerSetting('Упаковка товара', 'Packing', False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Standard'),
            CustomerMenu('Заказы', str(json.dumps([
                CustomerSection('Заказы', [
                    CustomerSetting('Заказы', 'Order', False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Order'),
            CustomerMenu('Каталог', str(json.dumps([
                CustomerSection('Каталог', [
                    CustomerSetting('Каталог', 'Catalogue', True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Catalogue'),
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
