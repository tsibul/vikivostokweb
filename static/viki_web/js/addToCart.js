/**
 * Cart Module for modern browsers
 * Uses ES modules
 */

import { initAddToCart } from './cart/addToCart/index.js';
import eventBus from './cart/eventBus.js';

// Initialize add to cart functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the add to cart functionality
    initAddToCart();
    
    // Add immediate initialization for pages without cart module
    if (!window.CartManager) {
        console.log('CartManager not found, initializing add to cart functionality');
        initAddToCart();
    }
});

// Subscribe to cart initialization event as a backup
eventBus.subscribe('cart:initialized', () => {
    initAddToCart();
}); 