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

                CustomerSection('Компании', [
                    CustomerSetting('Клиенты', 'Customer', False),
                    CustomerSetting('Юр. лица', 'Company', False),
                    CustomerSetting('Банковские реквизиты', 'BankAccount', False),
                ]),
                CustomerSection('Менеджеры', [
                    CustomerSetting('Менеджеры', '', False),
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
        ]
        return menu_list
