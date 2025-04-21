'use strict';

import RecentlyViewed from './recentGoods.js';
import { 
    renderCart, 
    initCartQuantity, 
    initCartItemRemove, 
    initBranding,
    initDropdowns,
    initPriceManager,
    printOpportunitiesCache
} from './cart/index.js';

/**
 * Initialization of cart functions when document loads
 */
document.addEventListener('DOMContentLoaded', function () {
    renderCart();
    initCartQuantity();
    initCartItemRemove();
    initBranding();
    initDropdowns();
    initPriceManager(); // Initialize price manager
    RecentlyViewed.init();
    // Check if CartManager exists
    if (!window.CartManager) {
        window.CartManager = {
            updateBadge() {
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    cartCount.textContent = cart.length;
                    cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
                }
            }
        };
    }
    // Update cart badge
    window.CartManager.updateBadge();
});
