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
import { showAddToCartNotification, showErrorNotification } from './cart/addToCart/notification.js';
import { getCSRFToken } from './common/getCSRFToken.js';
import { initAuthCheck } from './cart/checkAuth.js';

/**
 * Initialization of cart functions when document loads
 * Now using Canvas-based rendering
 */
document.addEventListener('DOMContentLoaded', async function () {
    // Load print opportunities data first
    await loadPrintOpportunities();
    
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
