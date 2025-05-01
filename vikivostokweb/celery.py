import os
from celery import Celery

# Устанавливаем переменную окружения для настроек Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vikivostokweb.settings')

# Создаем экземпляр приложения Celery
app = Celery('vikivostokweb')

# Загружаем конфигурацию из настроек Django
# namespace='CELERY' означает что все настройки Celery 
# должны иметь префикс CELERY_ в настройках Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоматически обнаруживать задачи во всех приложениях проекта
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}') 