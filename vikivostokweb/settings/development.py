"""
Настройки для локальной разработки.
"""

import os
import configparser
from .base import *

# Загрузка .env файла если он есть
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, '.env'))
except ImportError:
    pass

# Для обратной совместимости поддерживаем config.cfg
config = configparser.RawConfigParser()
config.read(os.path.join(BASE_DIR, 'config.cfg'))

if config.has_section('LOG_PAS'):
    config_dict = dict(config.items('LOG_PAS'))
    DB_USER = config_dict.get('user', 'root')
    DB_PASS = config_dict.get('pass', '')
    SECRET_KEY = config_dict.get('sec_key', 'django-insecure-key')
    EMAIL_HOST_USER = config_dict.get('e_mail', '')
    EMAIL_HOST_PASSWORD = config_dict.get('e_mail_pass', '')
    RECAPTCHA_SITE_KEY = config_dict.get('recaptcha_site_key', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI')
    RECAPTCHA_SECRET_KEY = config_dict.get('recaptcha_secret_key', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe')
else:
    # Фоллбек значения если config.cfg не найден
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASS = os.getenv('DB_PASSWORD', '')
    SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key-change-me')
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
    RECAPTCHA_SITE_KEY = os.getenv('RECAPTCHA_SITE_KEY', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI')
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'localhost:8989']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'vikivostok_web',
        'USER': DB_USER,
        'PASSWORD': DB_PASS,
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# Email настройки для разработки
EMAIL_HOST = 'mail.vikivostok.ru'
EMAIL_PORT = 1234
EMAIL_USE_TLS = False

# Celery настройки для разработки
CELERY_ENABLED = True
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_WORKER_POOL = 'solo'  # Для Windows

# Logging для разработки (подробный вывод)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'debug.log'),
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'order_processing': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# Development-specific settings
INTERNAL_IPS = [
    '127.0.0.1',
]

