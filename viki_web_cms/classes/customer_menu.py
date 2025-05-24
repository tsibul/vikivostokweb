import json

class CustomerSetting:
    def __init__(self, setting: str, setting_class: str, upload: bool, new: bool, delete: bool = True):
        self.setting = setting
        self.setting_class = setting_class
        self.upload = upload
        self.new = new
        self.delete = delete

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
            CustomerMenu("Клиенты", str(json.dumps([
                CustomerSection('Состояния заказов', [
                    CustomerSetting('Состояния заказов', 'OrderState', False, False),
                ]),
                CustomerSection('Счета', [
                    CustomerSetting('Счета', 'Invoice', False, False),
                ]),
                CustomerSection('Наши компании', [
                    CustomerSetting('Юр. лица', 'OurCompany', False, False),
                    CustomerSetting('Банковские реквизиты', 'OurBank', False, False),
                ]),
                CustomerSection('Компании', [
                    CustomerSetting('Клиенты', 'Customer', False, True),
                    CustomerSetting('Юр. лица', 'Company', False, True),
                    CustomerSetting('Банковские реквизиты', 'BankAccount', False, False),
                ]),
                CustomerSection('Доставка', [
                    CustomerSetting('Опции доставки', 'DeliveryOption', False, False),
                ]),
                CustomerSection('Новости', [
                    CustomerSetting('Новости', 'News', False, False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Standard'),
            CustomerMenu('Контакты', str(json.dumps([
                CustomerSection('Контакты', [
                    CustomerSetting('Контакты', 'UserExtension', True, True, False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'UserExtension'),
            CustomerMenu('Заказы', str(json.dumps([
                CustomerSection('Заказы', [
                    CustomerSetting('Заказы', 'Order', False, True, False),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'Order'),
            CustomerMenu('Состав групп', str(json.dumps([
                CustomerSection('Состав групп', [
                    CustomerSetting('Состав групп', 'CustomerGroup', False, True),
                ]),
            ], default=lambda o: o.__dict__,
                sort_keys=True)), 'CustomerGroup'),
        ]
        return menu_list
