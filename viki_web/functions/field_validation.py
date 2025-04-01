import re


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
