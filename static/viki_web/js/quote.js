/**
 * Управление страницей коммерческого предложения
 */

'use strict';

/**
 * Инициализация страницы КП
 */
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация обработчиков событий
    initEventListeners();
    
    // Обновление брендирования и итогов для всех товаров
    document.querySelectorAll('.quote-item').forEach(item => {
        const itemId = item.querySelector('.quote-item__price-input').getAttribute('data-item-id');
        updateBrandingTotal(itemId);
        updateItemTotal(itemId);
    });
    
    // Обновление общих итогов
    updateTotals();
});

/**
 * Инициализация обработчиков событий
 */
function initEventListeners() {
    // Обработчик для кнопки генерации PDF
    const pdfButton = document.getElementById('generate-pdf');
    if (pdfButton) {
        pdfButton.addEventListener('click', generatePdf);
    }
    
    // Делегирование событий для изменения цен
    document.body.addEventListener('change', function(event) {
        const target = event.target;
        
        // Если изменилась цена товара
        if (target.classList.contains('quote-item__price-input')) {
            const itemId = target.getAttribute('data-item-id');
            updateItemTotal(itemId);
            updateTotals();
        }
        
        // Если изменилась цена брендирования
        if (target.classList.contains('quote-item__branding-price-input')) {
            const itemId = target.closest('.quote-item').querySelector('.quote-item__price-input').getAttribute('data-item-id');
            updateBrandingTotal(itemId);
            updateItemTotal(itemId);
            updateTotals();
        }
    });
    
    // Делегирование событий для ввода цен
    document.body.addEventListener('input', function(event) {
        const target = event.target;
        
        // Если изменилась цена товара
        if (target.classList.contains('quote-item__price-input')) {
            const itemId = target.getAttribute('data-item-id');
            updateItemTotal(itemId);
            updateTotals();
        }
        
        // Если изменилась цена брендирования
        if (target.classList.contains('quote-item__branding-price-input')) {
            const itemId = target.closest('.quote-item').querySelector('.quote-item__price-input').getAttribute('data-item-id');
            updateBrandingTotal(itemId);
            updateItemTotal(itemId);
            updateTotals();
        }
    });
}

/**
 * Обновление общей стоимости брендирования для товара
 * @param {string} itemId - ID товара
 */
function updateBrandingTotal(itemId) {
    const itemElement = document.querySelector(`.quote-item__price-input[data-item-id="${itemId}"]`).closest('.quote-item');
    const brandingItems = itemElement.querySelectorAll('.quote-item__branding-items .quote-item__price-row');
    const brandingTotalElement = itemElement.querySelector('.quote-item__branding-total-value');
    
    if (!brandingTotalElement) return;
    
    const quantity = parseInt(itemElement.querySelector('.quote-item__quantity').textContent) || 0;
    
    let brandingTotal = 0;
    
    // Суммирование стоимости всех элементов брендирования
    brandingItems.forEach(item => {
        const priceInput = item.querySelector('.quote-item__branding-price-input');
        const price = parseFloat(priceInput.value) || 0;
        const itemTotal = price * quantity;
        
        // Обновление итога по этому элементу брендирования
        const itemTotalElement = item.querySelector('.quote-item__branding-item-total');
        itemTotalElement.textContent = formatPrice(itemTotal);
        itemTotalElement.setAttribute('data-value', itemTotal);
        
        brandingTotal += itemTotal;
    });
    
    // Обновление общей стоимости брендирования
    brandingTotalElement.textContent = formatPrice(brandingTotal);
    brandingTotalElement.setAttribute('data-value', brandingTotal);
}

/**
 * Обновление итоговой суммы по товару
 * @param {string} itemId - ID товара
 */
function updateItemTotal(itemId) {
    const itemElement = document.querySelector(`.quote-item__price-input[data-item-id="${itemId}"]`).closest('.quote-item');
    const priceInput = itemElement.querySelector('.quote-item__price-input');
    const price = parseFloat(priceInput.value) || 0;
    const quantity = parseInt(itemElement.querySelector('.quote-item__quantity').textContent) || 0;
    
    // Обновление стоимости товара
    const totalElement = itemElement.querySelector('.quote-item__total-value');
    const itemTotal = price * quantity;
    totalElement.textContent = formatPrice(itemTotal);
    totalElement.setAttribute('data-value', itemTotal);
    
    // Получение стоимости брендирования
    let brandingTotal = 0;
    const brandingTotalElement = itemElement.querySelector('.quote-item__branding-total-value');
    
    if (brandingTotalElement) {
        brandingTotal = parseFloat(brandingTotalElement.getAttribute('data-value')) || 0;
    }
    
    // Обновление итоговой суммы по товару
    const finalTotalElement = itemElement.querySelector('.quote-item__final-total-value');
    const finalTotal = itemTotal + brandingTotal;
    finalTotalElement.textContent = formatPrice(finalTotal);
    finalTotalElement.setAttribute('data-value', finalTotal);
}

/**
 * Обновление общих итогов
 */
function updateTotals() {
    const items = document.querySelectorAll('.quote-item');
    const totalItemsElement = document.getElementById('quote-total-items');
    const totalSumElement = document.getElementById('quote-total-sum');
    
    if (!totalItemsElement || !totalSumElement) return;
    
    // Обновление количества позиций
    totalItemsElement.textContent = items.length;
    
    // Расчет общей суммы
    let totalSum = 0;
    items.forEach(item => {
        const finalTotalElement = item.querySelector('.quote-item__final-total-value');
        const finalTotal = parseFloat(finalTotalElement.getAttribute('data-value')) || 0;
        totalSum += finalTotal;
    });
    
    // Обновление общей суммы
    totalSumElement.textContent = formatPrice(totalSum);
}

/**
 * Форматирование цены
 * @param {number} price - Цена для форматирования
 * @returns {string} Отформатированная цена
 */
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

/**
 * Генерация PDF
 */
function generatePdf() {
    // Использование встроенного механизма печати браузера
    window.print();
} 