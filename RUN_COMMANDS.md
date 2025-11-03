# 🚀 Команды запуска для разных окружений

## 📋 Быстрая справка

| Окружение | Команда запуска | Настройки |
|-----------|----------------|-----------|
| **Development** | `python manage.py runserver` | `development.py` |
| **Production** | `DJANGO_ENV=production python manage.py ...` | `production.py` |

---

## 💻 **Development (Локальная разработка)**

### Запуск сервера разработки:

```bash
# Простой запуск (по умолчанию development)
python manage.py runserver

# Явно указать порт
python manage.py runserver 8080

# На всех интерфейсах
python manage.py runserver 0.0.0.0:8000
```

### Другие команды:

```bash
# Миграции
python manage.py makemigrations
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Django shell
python manage.py shell

# Собрать статику (редко нужно в dev)
python manage.py collectstatic
```

**Что используется:**
- ✅ Django development server
- ✅ DEBUG = True
- ✅ Подробные ошибки
- ✅ config.cfg или .env
- ✅ Автоперезагрузка кода

---

## 🚀 **Production (На сервере)**

### Способ 1: Через переменную DJANGO_ENV (рекомендую)

```bash
# Установить окружение
export DJANGO_ENV=production

# Теперь все команды работают с production настройками
python manage.py migrate
python manage.py collectstatic
python manage.py createsuperuser
```

### Способ 2: Указывать для каждой команды

```bash
DJANGO_ENV=production python manage.py migrate
DJANGO_ENV=production python manage.py collectstatic
```

### Способ 3: Через полное имя модуля

```bash
python manage.py migrate --settings=vikivostokweb.settings.production
python manage.py collectstatic --settings=vikivostokweb.settings.production
```

---

## ⚙️ **Настройка для постоянного использования**

### В .bashrc или .profile (для пользователя):

```bash
# Добавить в ~/.bashrc
export DJANGO_ENV=production
```

Применить:
```bash
source ~/.bashrc
```

### В systemd service файле:

```ini
[Service]
Environment="DJANGO_ENV=production"
# или
EnvironmentFile=/var/www/vikivostok/.env
```

В `.env` добавить:
```bash
DJANGO_ENV=production
```

---

## 🔄 **Gunicorn для Production**

### Прямой запуск:

```bash
# Установить окружение
export DJANGO_ENV=production

# Запустить Gunicorn
gunicorn vikivostokweb.wsgi:application \
    --workers 3 \
    --bind 0.0.0.0:8000
```

### Через Unix socket (для Nginx):

```bash
export DJANGO_ENV=production

gunicorn vikivostokweb.wsgi:application \
    --workers 3 \
    --bind unix:/var/www/vikivostok/vikivostok.sock \
    --error-logfile /var/www/vikivostok/logs/gunicorn-error.log \
    --access-logfile /var/www/vikivostok/logs/gunicorn-access.log
```

### Через systemd (автозапуск):

Файл `/etc/systemd/system/vikivostok.service`:

```ini
[Unit]
Description=Vikivostok Web Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vikivostok
Environment="PATH=/var/www/vikivostok/venv/bin"
Environment="DJANGO_ENV=production"
EnvironmentFile=/var/www/vikivostok/.env
ExecStart=/var/www/vikivostok/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/var/www/vikivostok/vikivostok.sock \
    vikivostokweb.wsgi:application

[Install]
WantedBy=multi-user.target
```

Команды:

```bash
# Запустить
sudo systemctl start vikivostok

# Остановить
sudo systemctl stop vikivostok

# Перезапустить
sudo systemctl restart vikivostok

# Автозапуск при загрузке
sudo systemctl enable vikivostok

# Статус
sudo systemctl status vikivostok

# Логи в реальном времени
sudo journalctl -u vikivostok -f
```

---

## 🔧 **Celery для Production**

### Прямой запуск:

```bash
export DJANGO_ENV=production

celery -A vikivostokweb worker -l info
```

### Через systemd:

Файл `/etc/systemd/system/vikivostok-celery.service`:

```ini
[Unit]
Description=Vikivostok Celery Worker
After=network.target redis.service

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=/var/www/vikivostok
Environment="PATH=/var/www/vikivostok/venv/bin"
Environment="DJANGO_ENV=production"
EnvironmentFile=/var/www/vikivostok/.env
ExecStart=/var/www/vikivostok/venv/bin/celery -A vikivostokweb worker -l info --detach

[Install]
WantedBy=multi-user.target
```

Команды:

```bash
sudo systemctl start vikivostok-celery
sudo systemctl stop vikivostok-celery
sudo systemctl restart vikivostok-celery
sudo systemctl status vikivostok-celery
```

---

## 📊 **Проверка текущего окружения**

```bash
# Проверить какие настройки используются
python manage.py diffsettings

# Или через Python shell
python manage.py shell
>>> from django.conf import settings
>>> settings.DEBUG
False  # Если production
>>> settings.ALLOWED_HOSTS
['yourdomain.com', 'www.yourdomain.com']
```

---

## 🎯 **Типичные сценарии**

### Первичное развертывание:

```bash
cd /var/www/vikivostok
source venv/bin/activate
export DJANGO_ENV=production

python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

# Или используйте скрипт
./scripts/deploy.sh
```

### Обновление кода:

```bash
cd /var/www/vikivostok
source venv/bin/activate
export DJANGO_ENV=production

git pull
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart vikivostok

# Или используйте скрипт
./scripts/update.sh --with-migrations
```

### Откат миграций:

```bash
export DJANGO_ENV=production
python manage.py migrate app_name migration_name
```

### Создание бэкапа:

```bash
./scripts/backup.sh
```

---

## 🔍 **Debug в production (осторожно!)**

```bash
# ВРЕМЕННО включить DEBUG для диагностики
# В .env измените:
DEBUG=True

# Перезапустите
sudo systemctl restart vikivostok

# ВАЖНО: Верните обратно после диагностики!
DEBUG=False
sudo systemctl restart vikivostok
```

**⚠️ Никогда не оставляйте DEBUG=True на production!**

---

## 📝 **Шпаргалка команд**

```bash
# Development
python manage.py runserver              # Запуск dev сервера
python manage.py makemigrations         # Создать миграции
python manage.py migrate                # Применить миграции
python manage.py createsuperuser        # Создать админа
python manage.py shell                  # Django shell

# Production
export DJANGO_ENV=production            # Установить окружение
python manage.py migrate                # Миграции
python manage.py collectstatic          # Собрать статику
sudo systemctl restart vikivostok       # Перезапуск
sudo journalctl -u vikivostok -f        # Логи

# Gunicorn прямой запуск (для теста)
gunicorn vikivostokweb.wsgi:application --bind 0.0.0.0:8000

# Celery прямой запуск (для теста)
celery -A vikivostokweb worker -l info
```

---

## ✨ **Итого**

| Вопрос | Ответ |
|--------|-------|
| Одинаковый ли запуск? | **Нет**, но максимально упрощен |
| Development | `python manage.py runserver` |
| Production | `export DJANGO_ENV=production` + команды |
| Автоматизация | Используйте `./scripts/*.sh` |
| Автозапуск | Настройте systemd service |

**Главное правило:** На production всегда устанавливайте `DJANGO_ENV=production` перед запуском команд!

