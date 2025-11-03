# 📋 Шпаргалка - Запуск в разных окружениях

## ⚡ Быстрый ответ

**НЕТ**, запуск **разный**, но теперь максимально прост:

```bash
# Development (локально)
python manage.py runserver

# Production (на сервере)
export DJANGO_ENV=production
python manage.py ...
```

---

## 🏠 **Development (как сейчас)**

```bash
# Запуск
python manage.py runserver

# Миграции
python manage.py makemigrations
python manage.py migrate

# Django shell
python manage.py shell
```

**Используется:** Django dev server, DEBUG=True, config.cfg

---

## 🚀 **Production (на сервере)**

### Вариант 1: Установить переменную один раз

```bash
# В терминале
export DJANGO_ENV=production

# Теперь все команды работают с production
python manage.py migrate
python manage.py collectstatic
```

### Вариант 2: Для каждой команды

```bash
DJANGO_ENV=production python manage.py migrate
DJANGO_ENV=production python manage.py collectstatic
```

### Вариант 3: Использовать готовые скрипты

```bash
./scripts/deploy.sh              # Первое развертывание
./scripts/update.sh              # Обновление без миграций
./scripts/update.sh --with-migrations  # С миграциями
./scripts/backup.sh              # Бэкап
```

---

## 🎯 **Gunicorn (production сервер)**

### Через systemd (рекомендую):

```bash
# Запуск
sudo systemctl start vikivostok

# Перезапуск
sudo systemctl restart vikivostok

# Логи
sudo journalctl -u vikivostok -f
```

### Вручную (для теста):

```bash
export DJANGO_ENV=production
gunicorn vikivostokweb.wsgi:application --bind 0.0.0.0:8000
```

---

## ⚙️ **Настройка systemd для постоянного использования**

Файл `/etc/systemd/system/vikivostok.service`:

```ini
[Service]
Environment="DJANGO_ENV=production"
EnvironmentFile=/var/www/vikivostok/.env
ExecStart=/var/www/vikivostok/venv/bin/gunicorn ...
```

**Или** добавьте в `.env`:

```bash
DJANGO_ENV=production
```

**Или** добавьте в `~/.bashrc`:

```bash
export DJANGO_ENV=production
```

---

## 📊 **Сравнение**

| Аспект | Development | Production |
|--------|-------------|------------|
| **Сервер** | Django runserver | Gunicorn + Nginx |
| **Команда** | `python manage.py runserver` | `systemctl start vikivostok` |
| **DEBUG** | True | False |
| **Настройки** | config.cfg / .env | .env |
| **Переменная** | `DJANGO_ENV=development` (по умолчанию) | `DJANGO_ENV=production` |
| **Автоперезагрузка** | Да | Нет |
| **Показ ошибок** | В браузере | В логах |

---

## ✅ **Что нужно сделать на сервере один раз:**

1. Создать `.env` из `env.example`
2. Добавить в `.env`: `DJANGO_ENV=production`
3. Настроить systemd service с этой переменной
4. Запустить: `sudo systemctl start vikivostok`

**После этого просто используйте `./scripts/update.sh` для обновлений!**

---

## 🔍 **Как проверить текущее окружение:**

```bash
python manage.py shell
>>> from django.conf import settings
>>> settings.DEBUG
False  # production
>>> settings.DATABASES['default']['NAME']
'vikivostok_web'
```

---

## 💡 **Итого:**

✅ **Development:** `python manage.py runserver` (как обычно)  
✅ **Production:** `export DJANGO_ENV=production` (один раз) + команды  
✅ **Или:** Используйте готовые скрипты `./scripts/*.sh`  

📖 **Подробнее:** См. `RUN_COMMANDS.md`

