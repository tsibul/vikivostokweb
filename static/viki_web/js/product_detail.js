/**
 * @fileoverview Module for handling product detail page functionality
 * @module product_detail
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация переключения изображений
    initImageNavigation();
});

/**
 * Инициализирует навигацию по изображениям товара
 */
function initImageNavigation() {
    const mainImageContainer = document.querySelector('.detail-page__main-image');
    if (!mainImageContainer) return;

    const images = mainImageContainer.querySelectorAll('img');
    if (images.length <= 1) return; // Нет смысла инициализировать навигацию, если только одно изображение

    const prevButton = mainImageContainer.querySelector('.detail-page__nav-button--prev');
    const nextButton = mainImageContainer.querySelector('.detail-page__nav-button--next');

    // Добавляем обработчики событий для кнопок
    prevButton.addEventListener('click', () => navigateImages('prev'));
    nextButton.addEventListener('click', () => navigateImages('next'));
}

/**
 * Переключает изображения в указанном направлении
 * @param {string} direction - Направление переключения ('prev' или 'next')
 */
function navigateImages(direction) {
    const mainImageContainer = document.querySelector('.detail-page__main-image');
    const images = Array.from(mainImageContainer.querySelectorAll('img'));

    // Находим текущее видимое изображение
    const currentImage = images.find(img => !img.classList.contains('item-hidden'));
    if (!currentImage) return;

    const currentIndex = images.indexOf(currentImage);
    let newIndex;

    if (direction === 'prev') {
        // Переход к предыдущему изображению (или к последнему, если текущее - первое)
        newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
        // Переход к следующему изображению (или к первому, если текущее - последнее)
        newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }

    images[newIndex].classList.remove('item-hidden');
    setTimeout(() => {
        currentImage.classList.add('item-opaque');
        images[newIndex].classList.remove('item-opaque');
    }, 1);
    setTimeout(() => {
        currentImage.classList.add('item-hidden')
    }, 200);

    // Обновляем информацию о товаре
    updateProductInfo(images[newIndex]);
}

/**
 * Обновляет информацию о товаре на основе данных из изображения
 * @param {HTMLImageElement} image - Изображение с данными товара
 */
function updateProductInfo(image) {
    const article = image.dataset.article;
    let price = '';

    // Проверяем наличие цены и выбираем подходящую
    if (image.dataset.price && image.dataset.price !== 'None' && image.dataset.price !== 'undefined' && image.dataset.price !== '') {
        price = image.dataset.price;
    } else if (image.dataset.goodsPrice && image.dataset.goodsPrice !== 'None' && image.dataset.goodsPrice !== 'undefined' && image.dataset.goodsPrice !== '') {
        price = image.dataset.goodsPrice;
    } else {
        price = '0'; // Значение по умолчанию, если цена не найдена
    }

    const colorDescription = image.dataset.colorDescription;

    // Обновляем артикул
    const articleElement = document.querySelector('.detail-page__article h3:first-child');
    if (articleElement) {
        articleElement.textContent = `Артикул: ${article}`;
    }

    // Обновляем цену
    const priceElement = document.querySelector('.detail-page__article h3.strong');
    if (priceElement) {
        priceElement.textContent = `Цена: ${price} руб.`;
    }

    // Обновляем цветовое описание
    const colorDescriptionContainer = document.querySelector('.detail-page__color-description');
    colorDescriptionContainer.textContent = colorDescription;
}

