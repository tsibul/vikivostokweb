# 🐳 Docker Deployment Guide

## ✅ **ДА! С Docker запуск одинаковый везде!**

Docker решает все проблемы с различиями между окружениями:
- ✅ Одинаковый запуск на dev и production
- ✅ Не нужно устанавливать зависимости вручную
- ✅ Изолированное окружение
- ✅ Легко масштабировать
- ✅ Просто обновлять

---

## 📋 Что включено

```
✅ Dockerfile - образ приложения
✅ docker-compose.yml - для development
✅ docker-compose.production.yml - для production
✅ Nginx - reverse proxy
✅ MariaDB - база данных
✅ Redis - для Celery
✅ Celery Worker - фоновые задачи
✅ Certbot - SSL сертификаты
```

---

## 🚀 Быстрый старт

### Prerequisites

Установите Docker и Docker Compose:

**Windows/Mac:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose
```

---

## 💻 Development (Локально)

### 1. Создайте .env файл:

```bash
cp env.example .env
```

Минимальный `.env` для development:

```bash
# Django
SECRET_KEY=dev-secret-key-change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email (можно оставить пустым для dev)
EMAIL_HOST_USER=office@vikivostok.ru
EMAIL_HOST_PASSWORD=password

# reCAPTCHA (тестовые ключи)
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

### 2. Запустите все сервисы:

```bash
docker-compose up -d
```

### 3. Примените миграции:

```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

### 4. Готово!

Откройте браузер: http://localhost:8000

---

## 🏗️ Production Deployment

### 1. На сервере создайте .env файл:

```bash
# Django
DJANGO_ENV=production
SECRET_KEY=<сгенерируйте длинный случайный ключ>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_NAME=vikivostok_web
DB_USER=vikivostok_prod
DB_PASSWORD=<strong_password>
DB_ROOT_PASSWORD=<root_password>

# Email
EMAIL_HOST=mail.vikivostok.ru
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=office@vikivostok.ru
EMAIL_HOST_PASSWORD=<email_password>

# reCAPTCHA
RECAPTCHA_SITE_KEY=<site_key>
RECAPTCHA_SECRET_KEY=<secret_key>

# Security
SECURE_SSL_REDIRECT=True
```

### 2. Отредактируйте nginx/conf.d/vikivostok.conf:

Замените `yourdomain.com` на ваш реальный домен.

### 3. Запустите production:

```bash
docker-compose -f docker-compose.production.yml up -d
```

### 4. Примените миграции:

```bash
docker-compose -f docker-compose.production.yml exec web python manage.py migrate
docker-compose -f docker-compose.production.yml exec web python manage.py createsuperuser
```

### 5. Получите SSL сертификат:

```bash
# Первичное получение сертификата
docker-compose -f docker-compose.production.yml run --rm certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot/ \
    -d yourdomain.com \
    -d www.yourdomain.com
```

### 6. Включите HTTPS в Nginx:

Раскомментируйте секции HTTPS в `nginx/conf.d/vikivostok.conf` и перезапустите:

```bash
docker-compose -f docker-compose.production.yml restart nginx
```

---

## 🔄 Основные команды

### Development:

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить
docker-compose down

# Просмотр логов
docker-compose logs -f web
docker-compose logs -f celery

# Выполнить команду Django
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py shell

# Перезапустить сервис
docker-compose restart web

# Пересобрать образ
docker-compose build web
docker-compose up -d --build
```

### Production:

```bash
# Запустить
docker-compose -f docker-compose.production.yml up -d

# Остановить
docker-compose -f docker-compose.production.yml down

# Логи
docker-compose -f docker-compose.production.yml logs -f web

# Выполнить команду
docker-compose -f docker-compose.production.yml exec web python manage.py migrate

# Перезапустить
docker-compose -f docker-compose.production.yml restart web

# Обновить и перезапустить
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 🔄 Обновление проекта

### Development:

```bash
git pull
docker-compose up -d --build
docker-compose exec web python manage.py migrate
```

### Production:

```bash
# Создать бэкап БД
docker-compose -f docker-compose.production.yml exec db \
    mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup.sql

# Обновить код
git pull

# Пересобрать и запустить
docker-compose -f docker-compose.production.yml up -d --build

# Применить миграции
docker-compose -f docker-compose.production.yml exec web python manage.py migrate

# Собрать статику (если нужно)
docker-compose -f docker-compose.production.yml exec web python manage.py collectstatic --noinput
```

---

## 💾 Бэкапы

### Бэкап базы данных:

```bash
# Development
docker-compose exec db mysqldump -u vikivostok -pdev_password vikivostok_web > backup.sql

# Production
docker-compose -f docker-compose.production.yml exec db \
    mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$(date +%Y%m%d).sql
```

### Восстановление:

```bash
# Development
docker-compose exec -T db mysql -u vikivostok -pdev_password vikivostok_web < backup.sql

# Production
docker-compose -f docker-compose.production.yml exec -T db \
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup.sql
```

---

## 🔍 Troubleshooting

### Проверка статуса контейнеров:

```bash
docker-compose ps
```

### Просмотр логов:

```bash
# Все логи
docker-compose logs

# Логи конкретного сервиса
docker-compose logs web
docker-compose logs -f celery  # с отслеживанием

# Последние 100 строк
docker-compose logs --tail=100 web
```

### Зайти внутрь контейнера:

```bash
docker-compose exec web bash
docker-compose exec db bash
```

### Проверка БД:

```bash
docker-compose exec db mysql -u vikivostok -pdev_password vikivostok_web -e "SHOW TABLES;"
```

### Очистка:

```bash
# Удалить все контейнеры и volumes (ОСТОРОЖНО!)
docker-compose down -v

# Очистить неиспользуемые образы
docker system prune -a
```

---

## 📊 Сравнение: Docker vs Обычный деплой

| Аспект | Обычный деплой | Docker |
|--------|----------------|--------|
| **Установка зависимостей** | Вручную на каждом сервере | Один раз в Dockerfile |
| **Запуск** | Разный (runserver vs gunicorn) | Одинаковый везде |
| **Окружение** | Может различаться | Идентичное |
| **Обновление** | Сложнее | `docker-compose up -d --build` |
| **Откат** | Сложный | `docker-compose down && docker-compose up` |
| **Масштабирование** | Сложно | `docker-compose scale web=3` |
| **Изоляция** | Общая система | Полная изоляция |

---

## ⚙️ Конфигурация для production

### Увеличить количество workers:

В `docker-compose.production.yml`:

```yaml
web:
  command: >
    sh -c "... gunicorn ... --workers 8 ..."
```

### Настроить автоматический рестарт:

Все сервисы уже имеют `restart: always`.

### Мониторинг ресурсов:

```bash
docker stats
```

---

## 🎯 Преимущества Docker

1. **Одинаковый запуск везде** - `docker-compose up` и на dev, и на prod
2. **Изолированное окружение** - не конфликтует с другими проектами
3. **Легкое масштабирование** - добавить больше workers
4. **Простое обновление** - `git pull && docker-compose up -d --build`
5. **Быстрый откат** - просто запустить предыдущий образ
6. **Воспроизводимость** - работает одинаково на всех машинах

---

## ✨ Итого

**Docker делает деплой максимально простым:**

```bash
# Development
docker-compose up -d

# Production  
docker-compose -f docker-compose.production.yml up -d

# Обновление
git pull && docker-compose up -d --build
```

**Одна команда для всего!** 🚀

