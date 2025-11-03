# 🚀 Руководство по развертыванию

## 📋 Оглавление
- [Структура проекта](#структура-проекта)
- [Локальная разработка](#локальная-разработка)
- [Развертывание Production](#развертывание-production)
- [Обновление проекта](#обновление-проекта)
- [Бэкапы](#бэкапы)

---

## 📁 Структура проекта

```
vikivostokweb/
├── vikivostokweb/
│   ├── settings/
│   │   ├── base.py          # Общие настройки
│   │   ├── development.py   # Локальная разработка
│   │   └── production.py    # Production
│   └── requirements/
│       ├── base.txt         # Общие зависимости
│       ├── development.txt  # Dev зависимости
│       └── production.txt   # Prod зависимости
├── .env                     # Переменные окружения (НЕ в git!)
├── env.example              # Пример переменных окружения
└── config.cfg               # Старый конфиг (для обратной совместимости)
```

---

## 💻 Локальная разработка

### 1. Клонирование и настройка

```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd vikivostokweb

# Создать виртуальное окружение
python -m venv venv

# Активировать (Windows)
venv\Scripts\activate

# Активировать (Linux/Mac)
source venv/bin/activate

# Установить зависимости для разработки
pip install -r vikivostokweb/requirements/development.txt
```

### 2. Настройка БД и переменных

Создайте `config.cfg` (для обратной совместимости) или `.env`:

```ini
# config.cfg
[LOG_PAS]
user = root
pass = your_password
sec_key = django-insecure-key-for-dev
e_mail = office@vikivostok.ru
e_mail_pass = your_email_password
recaptcha_site_key = test_key
recaptcha_secret_key = test_secret
```

### 3. Запуск

```bash
# Применить миграции
python manage.py migrate

# Запустить сервер разработки
python manage.py runserver
```

По умолчанию используется `vikivostokweb.settings.development`.

---

## 🚀 Развертывание Production

### 1. Подготовка сервера

```bash
# Обновить систему (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Установить зависимости
sudo apt install python3-pip python3-venv nginx mariadb-server redis-server git

# Установить Node.js (для фронтенда)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Клонирование проекта

```bash
# Создать директорию для проекта
sudo mkdir -p /var/www/vikivostok
sudo chown $USER:$USER /var/www/vikivostok

# Клонировать
cd /var/www/vikivostok
git clone <your-repo-url> .
```

### 3. Настройка окружения

```bash
# Создать виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Установить зависимости для production
pip install -r vikivostokweb/requirements/production.txt

# Скопировать пример env файла
cp env.example .env
```

### 4. Настройка .env файла

```bash
nano .env
```

Заполните **все** переменные из `env.example`:

```bash
DJANGO_SETTINGS_MODULE=vikivostokweb.settings.production
SECRET_KEY=<генерируйте длинный случайный ключ>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_USER=vikivostok_user
DB_PASSWORD=<strong_password>
# ... остальные переменные
```

**Генерация SECRET_KEY:**
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Настройка БД

```bash
# Войти в MariaDB
sudo mysql

# Создать базу и пользователя
CREATE DATABASE vikivostok_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vikivostok_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON vikivostok_web.* TO 'vikivostok_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Применить миграции
python manage.py migrate

# Собрать статику
python manage.py collectstatic --noinput

# Импортировать данные (если нужно)
mysql -u vikivostok_user -p vikivostok_web < seo_data.sql
```

### 6. Настройка Gunicorn

Создайте systemd service:

```bash
sudo nano /etc/systemd/system/vikivostok.service
```

```ini
[Unit]
Description=Vikivostok Web Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vikivostok
Environment="PATH=/var/www/vikivostok/venv/bin"
Environment="DJANGO_SETTINGS_MODULE=vikivostokweb.settings.production"
EnvironmentFile=/var/www/vikivostok/.env
ExecStart=/var/www/vikivostok/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/var/www/vikivostok/vikivostok.sock \
    vikivostokweb.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 7. Настройка Celery

```bash
sudo nano /etc/systemd/system/vikivostok-celery.service
```

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
EnvironmentFile=/var/www/vikivostok/.env
ExecStart=/var/www/vikivostok/venv/bin/celery -A vikivostokweb worker -l info --detach

[Install]
WantedBy=multi-user.target
```

### 8. Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/vikivostok
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 100M;

    location /static/ {
        alias /var/www/vikivostok/staticfiles/;
    }

    location /media/ {
        alias /var/www/vikivostok/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/vikivostok/vikivostok.sock;
    }
}
```

Активировать сайт:

```bash
sudo ln -s /etc/nginx/sites-available/vikivostok /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Запуск сервисов

```bash
# Запустить и включить автозапуск
sudo systemctl start vikivostok
sudo systemctl enable vikivostok

sudo systemctl start vikivostok-celery
sudo systemctl enable vikivostok-celery

sudo systemctl start redis
sudo systemctl enable redis

# Проверить статус
sudo systemctl status vikivostok
sudo systemctl status vikivostok-celery
```

### 10. Настройка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔄 Обновление проекта

### Простое обновление (без миграций)

```bash
# На сервере
cd /var/www/vikivostok
source venv/bin/activate

# Получить изменения
git pull origin main

# Обновить зависимости (если изменились)
pip install -r vikivostokweb/requirements/production.txt

# Собрать статику
python manage.py collectstatic --noinput

# Перезапустить сервисы
sudo systemctl restart vikivostok
sudo systemctl restart vikivostok-celery
```

### Обновление с миграциями БД

```bash
cd /var/www/vikivostok
source venv/bin/activate

# ВАЖНО: Сделать бэкап БД перед миграциями!
mysqldump -u vikivostok_user -p vikivostok_web > backup_$(date +%Y%m%d_%H%M%S).sql

# Получить изменения
git pull origin main

# Применить миграции
python manage.py migrate

# Собрать статику
python manage.py collectstatic --noinput

# Перезапустить
sudo systemctl restart vikivostok
sudo systemctl restart vikivostok-celery
```

---

## 💾 Бэкапы

### Автоматический бэкап БД

Создайте скрипт `/usr/local/bin/backup-vikivostok.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/vikivostok"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Бэкап БД
mysqldump -u vikivostok_user -p'your_password' vikivostok_web | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Удалить бэкапы старше 30 дней
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

Добавьте в crontab:

```bash
sudo crontab -e

# Бэкап каждый день в 2:00 ночи
0 2 * * * /usr/local/bin/backup-vikivostok.sh
```

---

## 📝 Полезные команды

```bash
# Просмотр логов Django
sudo journalctl -u vikivostok -f

# Просмотр логов Celery
sudo journalctl -u vikivostok-celery -f

# Просмотр логов Nginx
sudo tail -f /var/log/nginx/error.log

# Перезапуск всех сервисов
sudo systemctl restart vikivostok vikivostok-celery nginx

# Проверка статуса Redis
redis-cli ping
```

---

## 🔒 Безопасность

1. **Никогда не храните .env и config.cfg в Git**
2. **Используйте сильные пароли для БД**
3. **Обновляйте зависимости регулярно**: `pip list --outdated`
4. **Мониторьте логи на предмет подозрительной активности**
5. **Настройте firewall**: `sudo ufw allow 80,443/tcp`

---

## 📞 Troubleshooting

### Проблема: 502 Bad Gateway

```bash
# Проверить статус Gunicorn
sudo systemctl status vikivostok

# Проверить логи
sudo journalctl -u vikivostok -n 50
```

### Проблема: Статика не загружается

```bash
# Пересобрать статику
python manage.py collectstatic --clear --noinput

# Проверить права
sudo chown -R www-data:www-data /var/www/vikivostok/staticfiles
```

### Проблема: Миграции не применяются

```bash
# Показать список миграций
python manage.py showmigrations

# Применить принудительно
python manage.py migrate --run-syncdb
```

