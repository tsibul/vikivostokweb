# 🔧 Конфигурация проекта для Production

## ✅ Что было сделано

Проект настроен для удобного развертывания и обновления с разделением настроек на **development** и **production**.

### 📁 Новая структура:

```
vikivostokweb/
├── vikivostokweb/
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py          ← Общие настройки
│   │   ├── development.py   ← Локальная разработка
│   │   └── production.py    ← Production
│   └── requirements/
│       ├── base.txt         ← Общие зависимости
│       ├── development.txt  ← Dev зависимости
│       └── production.txt   ← Prod зависимости
├── .gitignore               ← Исключает .env и секреты из Git
├── env.example              ← Пример переменных окружения
├── DEPLOYMENT.md            ← Полная инструкция по развертыванию
└── config.cfg               ← Старый конфиг (сохранен для обратной совместимости)
```

---

## 🚀 Быстрый старт

### Локальная разработка (сейчас)

Ничего не меняется! Проект продолжит работать с текущим `config.cfg`:

```bash
python manage.py runserver
```

### Production (на сервере)

1. **Создайте `.env` файл** на основе `env.example`:
   ```bash
   cp env.example .env
   nano .env  # Заполните реальные значения
   ```

2. **Установите переменную окружения**:
   ```bash
   export DJANGO_SETTINGS_MODULE=vikivostokweb.settings.production
   ```

3. **Запустите**:
   ```bash
   python manage.py migrate
   python manage.py collectstatic
   gunicorn vikivostokweb.wsgi:application
   ```

---

## 📝 Переменные окружения (.env)

### Обязательные для production:

```bash
# Django
SECRET_KEY=<длинный-случайный-ключ>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# База данных
DB_USER=vikivostok_user
DB_PASSWORD=<strong_password>

# Email
EMAIL_HOST_USER=office@vikivostok.ru
EMAIL_HOST_PASSWORD=<email_password>

# reCAPTCHA
RECAPTCHA_SITE_KEY=<site_key>
RECAPTCHA_SECRET_KEY=<secret_key>
```

**Генерация SECRET_KEY:**
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 🔄 Процесс обновления на сервере

### 1. Простое обновление (без миграций БД):

```bash
cd /var/www/vikivostok
git pull origin main
python manage.py collectstatic --noinput
sudo systemctl restart vikivostok
```

### 2. Обновление с миграциями:

```bash
# Сделать бэкап БД!
mysqldump -u user -p vikivostok_web > backup.sql

cd /var/www/vikivostok
git pull origin main
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart vikivostok
```

---

## 🔒 Безопасность

### ✅ Что защищено:

1. **`.env` в `.gitignore`** - секреты не попадут в Git
2. **`config.cfg` в `.gitignore`** - старые секреты тоже защищены
3. **Production настройки**:
   - `DEBUG=False`
   - HTTPS редирект
   - Secure cookies
   - HSTS headers
   - XSS protection

### ⚠️ Важно:

- **Никогда не коммитьте `.env` или `config.cfg`**
- **Используйте разные SECRET_KEY для dev и prod**
- **Регулярно обновляйте зависимости**

---

## 📚 Дополнительно

### Выбор настроек вручную:

```bash
# Development
python manage.py runserver --settings=vikivostokweb.settings.development

# Production
python manage.py migrate --settings=vikivostokweb.settings.production
```

### Или через переменную окружения:

```bash
# Windows
set DJANGO_SETTINGS_MODULE=vikivostokweb.settings.production

# Linux/Mac
export DJANGO_SETTINGS_MODULE=vikivostokweb.settings.production
```

---

## 📖 Полная документация

См. **[DEPLOYMENT.md](DEPLOYMENT.md)** для:
- Настройки Nginx
- Конфигурации Gunicorn
- Настройки Celery
- SSL сертификатов
- Автоматических бэкапов
- Troubleshooting

---

## 🤝 Обратная совместимость

Старый `config.cfg` **продолжит работать** в development режиме:
- Если `config.cfg` существует, настройки берутся из него
- Если нет - используются переменные окружения из `.env`

Это позволяет **постепенно** мигрировать без поломки текущей разработки.

---

## ❓ FAQ

**Q: Нужно ли что-то менять для локальной разработки?**  
A: Нет, всё продолжит работать с текущим `config.cfg`.

**Q: Как переключиться на .env для локальной разработки?**  
A: Создайте `.env` файл и удалите/переименуйте `config.cfg`.

**Q: Где хранить секреты на production?**  
A: В файле `.env` на сервере (не в Git!) или в переменных окружения системы.

**Q: Как обновлять проект без простоя?**  
A: Используйте zero-downtime deployment с двумя Gunicorn процессами (см. DEPLOYMENT.md).

