/**
 * Main cart initialization
 * This file is the entry point for the cart functionality
 */

'use strict';

import RecentlyViewed from './recentGoods.js';
import { 
    initCart,
    loadPrintOpportunities,
    updateCartBadge
} from './cart/index.js';
import { showAddToCartNotification, showErrorNotification, showDiscountNotification } from './cart/addToCart/notification.js';
import { getCSRFToken } from './common/getCSRFToken.js';
import { initAuthCheck } from './cart/checkAuth.js';
import { applyDiscountsToItems } from './cart/pricing/discountManager.js';

/**
 * Load and cache volume discounts from the server
 * @returns {Promise<Array>} Promise that resolves with volume discounts data
 */
async function loadVolumeDiscounts() {
    try {
        const response = await fetch('/api/volume-discounts/');
        if (!response.ok) {
            throw new Error('Failed to fetch volume discounts');
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Error fetching volume discounts');
        }
        
        // Cache the discounts in localStorage
        localStorage.setItem('volumeDiscounts', JSON.stringify(data.discounts));
        
        console.log('Volume discounts loaded and cached');
        return data.discounts;
    } catch (error) {
        console.error('Error loading volume discounts:', error);
        // If there's an error, try to return cached data
        const cachedDiscounts = localStorage.getItem('volumeDiscounts');
        return cachedDiscounts ? JSON.parse(cachedDiscounts) : [];
    }
}

/**
 * Очистить корзину полностью
 * Показывает стилизованный диалог подтверждения и очищает корзину при подтверждении
 */
function clearCart() {
    // Находим диалог подтверждения
    const confirmDialog = document.querySelector('.cart-clear-confirm');
    if (!confirmDialog) return;
    
    // Получаем элементы диалога
    const closeBtn = confirmDialog.querySelector('.confirm-dialog__close');
    const cancelBtn = confirmDialog.querySelector('.confirm-dialog__cancel-btn');
    const confirmBtn = confirmDialog.querySelector('.confirm-dialog__confirm-btn');
    
    // Функция закрытия диалога
    const closeDialog = () => {
        confirmDialog.close();
    };
    
    // Функция подтверждения очистки
    const confirmClear = () => {
        // Удаляем данные корзины из localStorage
        localStorage.removeItem('cart');
        
        // Закрываем диалог
        closeDialog();
        
        // Перезагружаем страницу для обновления интерфейса
        window.location.reload();
    };
    
    // Добавляем обработчики событий
    closeBtn.addEventListener('click', closeDialog, { once: true });
    cancelBtn.addEventListener('click', closeDialog, { once: true });
    confirmBtn.addEventListener('click', confirmClear, { once: true });
    
    // Открываем диалог
    confirmDialog.showModal();
}

/**
 * Initialization of cart functions when document loads
 * Now using Canvas-based rendering
 */
document.addEventListener('DOMContentLoaded', async function () {
    // Load print opportunities data first
    await loadPrintOpportunities();
    
    // Load and cache volume discounts
    await loadVolumeDiscounts();
    
    // Initialize cart
    initCart();
    
    // Initialize recently viewed
    RecentlyViewed.init();
    
    // Initialize authentication check for checkout
    initAuthCheck();
    
    // Initialize quote button
    const quoteButton = document.querySelector('.cart-summary__quote');
    if (quoteButton) {
        quoteButton.addEventListener('click', function() {
            // Handle quote generation
            generateQuote();
        });
    }
    
    // Initialize apply discounts button
    const applyDiscountsButton = document.querySelector('.cart-summary__apply-discounts');
    if (applyDiscountsButton) {
        // Enable the button if cart has items
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cartItems.length > 0) {
            applyDiscountsButton.disabled = false;
        }
        
        applyDiscountsButton.addEventListener('click', async function() {
            // Apply discounts to cart items
            const discountsApplied = await applyDiscountsToItems();
            
            if (discountsApplied) {
                showDiscountNotification('Скидки успешно применены к товарам');
            } else {
                showDiscountNotification('Нет подходящих товаров для скидок или сумма заказа недостаточна.');
            }
        });
    }
    
    // Инициализация кнопки очистки корзины
    const clearCartButton = document.querySelector('.cart-clear-btn');
    if (clearCartButton) {
        // Отображаем кнопку только если в корзине есть товары
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cartItems.length === 0) {
            clearCartButton.parentElement.style.display = 'none';
        }
        
        // Добавляем обработчик нажатия
        clearCartButton.addEventListener('click', clearCart);
    }
    
    // Expose CartManager for external use
    if (!window.CartManager) {
        window.CartManager = {
            updateBadge: updateCartBadge
        };
    }
    
    // Update cart badge
    window.CartManager.updateBadge();
});

/**
 * Generate quote based on cart items
 */
function generateQuote() {
    // Получаем данные корзины напрямую из localStorage
    const cartItems = localStorage.getItem('cart');
    
    // Проверяем, есть ли данные в корзине
    if (!cartItems || cartItems === '[]') {
        showErrorNotification('Корзина пуста. Добавьте товары для формирования КП.');
        return;
    }
    
    // Создаем форму для отправки данных (это гарантирует перенаправление)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/quote/';
    form.style.display = 'none';
    
    // Создаем поле для данных корзины
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'cart_data';
    input.value = cartItems;
    
    // CSRF токен
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrfmiddlewaretoken';
    csrfInput.value = getCSRFToken();
    
    // Добавляем поля в форму
    form.appendChild(input);
    form.appendChild(csrfInput);
    
    // Добавляем форму в документ и отправляем
    document.body.appendChild(form);
    form.submit();
}
