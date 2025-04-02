import re
import requests


def name_validation(name: str) -> bool:
    if name == "":
        return True
    pattern = r'^[А-ЯA-Z][а-яa-zА-ЯA-Z-]+$'
    return bool(re.fullmatch(pattern, name))


def phone_validation(phone: str) -> bool:
    if phone == "":
        return True
    pattern = r'^[+()\d\s-]{1,18}$'
    return bool(re.fullmatch(pattern, phone))


def inn_validation(text):
    return bool(re.fullmatch(r"\d{10}|\d{12}", text))


def account_validation(text):
    return bool(re.fullmatch(r"\d{20}}", text))


def bic_validation(bic):
    """
    Валидация БИК (Банковский Идентификационный Код)
    БИК состоит из 9 цифр
    Возвращает:
    - False если БИК невалидный
    - dict с данными банка если БИК валидный
    """
    if not bic or not re.match(r'^[0-9]{9}$', bic):
        return False
        
    url = f"https://bik-info.ru/api.html?type=json&bik={bic}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data.get('name') and data.get('ks') and data.get('city'):
                return {
                    'name': data['name'].replace('&quot;', '"'),
                    'corr_account': data['ks'],
                    'city': data['city']
                }
    except (requests.RequestException, ValueError):
        return False
