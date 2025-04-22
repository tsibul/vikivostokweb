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
    
    // Expose CartManager for external use
    if (!window.CartManager) {
        window.CartManager = {
            updateBadge: updateCartBadge
        };
    }
    
    // Update cart badge
    window.CartManager.updateBadge();
});
