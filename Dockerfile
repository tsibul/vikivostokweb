# Multi-stage build для уменьшения размера образа
FROM python:3.11-slim as base

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Установка Node.js для фронтенда
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Рабочая директория
WORKDIR /app

# Копирование requirements
COPY vikivostokweb/requirements/base.txt requirements/base.txt
COPY vikivostokweb/requirements/production.txt requirements/production.txt

# Установка Python зависимостей
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements/production.txt

# Копирование package.json для фронтенда
COPY package*.json ./
RUN npm install

# Копирование всего проекта
COPY . .

# Сборка фронтенда
RUN npm run build

# Создание директорий для статики и логов
RUN mkdir -p staticfiles logs media

# Сборка статики (будет выполнено при старте, но можно и здесь)
# RUN python manage.py collectstatic --noinput

# Открыть порт
EXPOSE 8000

# Запуск через gunicorn
CMD ["gunicorn", "vikivostokweb.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

