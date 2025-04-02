import configparser
import os

from django.conf import settings
from dadata import Dadata


def dadata_parse_inn(inn):
    config_path = os.path.join(settings.BASE_DIR, 'config.cfg')
    config = configparser.RawConfigParser()
    config.read(config_path)
    try:
        token = config.get('LOG_PAS', 'dadata_token')
    except (configparser.NoSectionError, configparser.NoOptionError):
        return {'errors': 'Missing API token in config'}
    try:
        dadata = Dadata(token)
        result = dadata.suggest('party', inn)
    except Exception as e:
        return {'errors': f'Dadata API error: {str(e)}'}
    if not result or not result[0]:
        return {'errors': 'inn', 'status': 'error', 'message': 'Некорректный ИНН'}
    return {'errors': None, 'result': result[0]}