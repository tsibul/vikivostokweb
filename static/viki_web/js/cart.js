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
    // Get cart data from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length === 0) {
        showErrorNotification('Корзина пуста. Добавьте товары для формирования КП.');
        return;
    }
    
    // Here you would typically send a request to the server
    // For now, we'll just show a notification
    showAddToCartNotification({
        name: 'Коммерческое предложение',
        article: 'КП'
    }, false, 5000);
    
    // In a real implementation, you would send the cart data to the server
    // and either redirect to a quote page or download a generated quote file
}
