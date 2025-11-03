# 🐳 Docker - Самый простой способ!

## ⚡ Почему Docker?

С Docker **запуск одинаковый** на development и production:

```bash
# И там, и там:
docker-compose up -d
```

**Никаких различий в командах!** 🎉

---

## 🚀 Быстрый старт (3 команды)

### Development (локально):

```bash
# 1. Создать .env
cp env.example .env

# 2. Запустить всё
docker-compose up -d

# 3. Применить миграции
docker-compose exec web python manage.py migrate
```

**Готово!** Открывайте http://localhost:8000

---

### Production (на сервере):

```bash
# 1. Создать .env с production настройками
nano .env

# 2. Запустить всё
docker-compose -f docker-compose.production.yml up -d

# 3. Применить миграции
docker-compose -f docker-compose.production.yml exec web python manage.py migrate
```

**Готово!** Сайт работает с Nginx, SSL, и всем остальным.

---

## 📊 Сравнение способов

| | **Без Docker** | **С Docker** |
|---|---|---|
| **Установка зависимостей** | Вручную: Python, MySQL, Redis, Node.js... | Автоматически в контейнере |
| **Запуск Development** | `python manage.py runserver` | `docker-compose up -d` |
| **Запуск Production** | `export DJANGO_ENV=production`<br>`gunicorn...` | `docker-compose -f docker-compose.production.yml up -d` |
| **Обновление** | `git pull`<br>`pip install`<br>`python manage.py migrate`<br>`systemctl restart...` | `git pull`<br>`docker-compose up -d --build` |
| **Одинаковый запуск?** | ❌ Нет | ✅ Да |
| **Настройка окружения** | Много шагов | Один Dockerfile |
| **Изоляция** | Нет | Полная |

---

## 🎯 Основные команды

```bash
# Запустить (development)
docker-compose up -d

# Запустить (production)
docker-compose -f docker-compose.production.yml up -d

# Остановить
docker-compose down

# Логи
docker-compose logs -f web

# Выполнить команду Django
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py shell

# Обновить проект
git pull
docker-compose up -d --build

# Бэкап БД
docker-compose exec db mysqldump -u vikivostok -p vikivostok_web > backup.sql
```

---

## 📦 Что включено

При запуске `docker-compose up` автоматически поднимаются:

1. **web** - Django приложение (Gunicorn в production)
2. **db** - MariaDB база данных
3. **redis** - для Celery очередей
4. **celery** - фоновые задачи
5. **nginx** - веб-сервер (только в production)
6. **certbot** - SSL сертификаты (только в production)

**Всё настроено и работает из коробки!**

---

## 🔄 Workflow с Docker

### Development:

```bash
# Запуск
docker-compose up -d

# Работа с кодом (редактируете как обычно)
# Изменения применяются автоматически благодаря volumes

# Если изменились requirements.txt
docker-compose build web
docker-compose up -d

# Остановка
docker-compose down
```

### Production:

```bash
# Первичное развертывание
git clone ...
cd vikivostok
cp env.example .env
nano .env  # Заполнить production настройки
docker-compose -f docker-compose.production.yml up -d

# Обновление
git pull
docker-compose -f docker-compose.production.yml up -d --build
docker-compose -f docker-compose.production.yml exec web python manage.py migrate
```

---

## 💡 Преимущества Docker

1. ✅ **Одинаковый запуск везде** - никаких "у меня работает"
2. ✅ **Не нужно настраивать окружение** - всё в контейнере
3. ✅ **Изоляция** - не конфликтует с другими проектами
4. ✅ **Легко масштабировать** - добавить больше workers
5. ✅ **Быстрый откат** - если что-то пошло не так
6. ✅ **Простое обновление** - одна команда

---

## 🆚 Docker vs Традиционный деплой

### Традиционный способ:
```bash
# На сервере
sudo apt install python3 mysql nodejs nginx...
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
# Настройка systemd, nginx, certbot...
# Много шагов!
```

### Docker способ:
```bash
# На сервере
docker-compose -f docker-compose.production.yml up -d
# Готово! 🎉
```

---

## 📖 Подробная документация

См. **[DOCKER.md](DOCKER.md)** для:
- Детальной настройки
- SSL сертификатов
- Бэкапов и восстановления
- Troubleshooting
- Advanced конфигурации

---

## 🎯 Рекомендация

**Используйте Docker если:**
- ✅ Хотите максимально простой деплой
- ✅ Нужна одинаковая среда везде
- ✅ Планируете масштабирование
- ✅ Цените изоляцию и безопасность

**Используйте традиционный деплой если:**
- ⚠️ Нет возможности использовать Docker на сервере
- ⚠️ Очень специфичные требования к окружению

---

## ✨ Итого

**С Docker всё проще:**

| Задача | Команда |
|--------|---------|
| Запуск dev | `docker-compose up -d` |
| Запуск prod | `docker-compose -f docker-compose.production.yml up -d` |
| Обновление | `git pull && docker-compose up -d --build` |
| Логи | `docker-compose logs -f` |
| Миграции | `docker-compose exec web python manage.py migrate` |

**Один и тот же подход везде! 🚀**

