#!/bin/bash
# Скрипт для создания бэкапа БД и важных файлов

set -e

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Создание бэкапа..."

# Создать директорию для бэкапов
mkdir -p $BACKUP_DIR

# Загрузка учетных данных из .env
if [ -f .env ]; then
    source .env
else
    echo "❌ Файл .env не найден!"
    exit 1
fi

# Бэкап базы данных
echo "📊 Бэкап базы данных..."
DB_BACKUP="$BACKUP_DIR/db_$DATE.sql"
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $DB_BACKUP
gzip $DB_BACKUP
echo "✅ БД сохранена: ${DB_BACKUP}.gz"

# Бэкап медиа файлов (если есть)
if [ -d "media" ]; then
    echo "📸 Бэкап медиа файлов..."
    MEDIA_BACKUP="$BACKUP_DIR/media_$DATE.tar.gz"
    tar -czf $MEDIA_BACKUP media/
    echo "✅ Медиа сохранены: $MEDIA_BACKUP"
fi

# Бэкап важных конфигов
echo "⚙️  Бэкап конфигурации..."
CONFIG_BACKUP="$BACKUP_DIR/config_$DATE.tar.gz"
tar -czf $CONFIG_BACKUP .env env.example vikivostokweb/settings/ 2>/dev/null || true
echo "✅ Конфиги сохранены: $CONFIG_BACKUP"

# Удаление старых бэкапов (старше 30 дней)
echo "🧹 Очистка старых бэкапов (>30 дней)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo ""
echo "✅ Бэкап завершен!"
echo "📁 Файлы сохранены в: $BACKUP_DIR/"
ls -lh $BACKUP_DIR/ | tail -5

