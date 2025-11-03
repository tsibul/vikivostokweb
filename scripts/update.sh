#!/bin/bash
# Скрипт для обновления проекта на production

set -e  # Выход при ошибке

echo "🔄 Обновление Vikivostok Web..."

# Получение текущей ветки
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Текущая ветка: $CURRENT_BRANCH"

# Бэкап БД перед обновлением
if [ "$1" == "--with-migrations" ]; then
    echo "💾 Создание бэкапа БД..."
    BACKUP_DIR="backups"
    mkdir -p $BACKUP_DIR
    BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Загрузка учетных данных из .env
    source .env
    mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE
    echo "✅ Бэкап создан: $BACKUP_FILE"
fi

# Получение обновлений
echo "📥 Получение обновлений из Git..."
git pull origin $CURRENT_BRANCH

# Активация виртуального окружения
source venv/bin/activate

# Обновление зависимостей (если нужно)
if [ -f "vikivostokweb/requirements/production.txt" ]; then
    echo "📦 Проверка зависимостей..."
    pip install -r vikivostokweb/requirements/production.txt
fi

# Установка окружения
export DJANGO_ENV=production

# Применение миграций (если указан флаг)
if [ "$1" == "--with-migrations" ]; then
    echo "🔄 Применение миграций..."
    python manage.py migrate
fi

# Сборка статики
echo "📁 Сборка статических файлов..."
python manage.py collectstatic --noinput

# Сборка фронтенда (если есть изменения)
if [ -d "node_modules" ] && [ -f "webpack.config.js" ]; then
    echo "🎨 Сборка фронтенда..."
    npm run build
fi

# Перезапуск сервисов
echo "♻️  Перезапуск сервисов..."
sudo systemctl restart vikivostok
sudo systemctl restart vikivostok-celery

# Проверка статуса
echo ""
echo "🔍 Проверка статуса сервисов..."
sudo systemctl is-active --quiet vikivostok && echo "✅ vikivostok: работает" || echo "❌ vikivostok: не работает"
sudo systemctl is-active --quiet vikivostok-celery && echo "✅ vikivostok-celery: работает" || echo "❌ vikivostok-celery: не работает"

echo ""
echo "✅ Обновление завершено!"
echo ""
echo "📝 Посмотреть логи:"
echo "  sudo journalctl -u vikivostok -f"

