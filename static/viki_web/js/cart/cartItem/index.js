/**
 * Cart Item Module Index
 * Entry point for cart item functionality
 */

import { initCartItemView } from './cartItemView.js';
import { initializeCartItems } from './cartItemStore.js';
import eventBus from '../eventBus.js';
import { getCartItems } from '../cartStorage.js';

/**
 * Initialize all cart item functionality
 */
export function initCartItems() {
    // Initialize store with current cart data
    initializeCartItems(getCartItems());
    
    // Initialize view components
    initCartItemView();
    
    // Subscribe to cart update events to keep store in sync
    eventBus.subscribe('cart:updated', (items) => {
        initializeCartItems(items || getCartItems());
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCartItems, 300);
});

// Export all needed functions
export * from './cartItemStore.js'; 