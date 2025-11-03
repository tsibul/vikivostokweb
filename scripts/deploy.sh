#!/bin/bash
# Скрипт для развертывания на production сервере

set -e  # Выход при ошибке

echo "🚀 Начинаем развертывание Vikivostok Web..."

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "Создайте .env на основе env.example:"
    echo "cp env.example .env"
    echo "nano .env"
    exit 1
fi

# Активация виртуального окружения
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ Виртуальное окружение не найдено!"
    echo "Создайте его: python3 -m venv venv"
    exit 1
fi

# Установка/обновление зависимостей
echo "📦 Обновление зависимостей..."
pip install -r vikivostokweb/requirements/production.txt

# Установка окружения
export DJANGO_ENV=production

# Применение миграций
echo "🔄 Применение миграций БД..."
python manage.py migrate

# Сборка статики
echo "📁 Сборка статических файлов..."
python manage.py collectstatic --noinput

# Сборка фронтенда
if [ -d "node_modules" ]; then
    echo "🎨 Сборка фронтенда..."
    npm run build
fi

# Перезапуск сервисов
echo "♻️  Перезапуск сервисов..."
if command -v systemctl &> /dev/null; then
    sudo systemctl restart vikivostok
    sudo systemctl restart vikivostok-celery
    echo "✅ Сервисы перезапущены"
else
    echo "⚠️  systemctl не найден, перезапустите сервисы вручную"
fi

echo ""
echo "✅ Развертывание завершено успешно!"
echo ""
echo "📝 Полезные команды:"
echo "  Логи Django:  sudo journalctl -u vikivostok -f"
echo "  Логи Celery:  sudo journalctl -u vikivostok-celery -f"
echo "  Статус:       sudo systemctl status vikivostok"

