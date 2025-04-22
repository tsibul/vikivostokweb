/**
 * Add To Cart Module Index
 * Exports all add to cart functionality
 */

import { initAddToCartEvents } from './eventHandler.js';
import { extractProductData } from './productExtractor.js';
import { addProductToCart, ADD_TO_CART_EVENT } from './addProduct.js';
import { showAddToCartNotification, showErrorNotification } from './notification.js';

/**
 * Initialize add to cart functionality
 */
export function initAddToCart() {
    initAddToCartEvents();
}

// Export all required functions and constants
export {
    extractProductData,
    addProductToCart,
    ADD_TO_CART_EVENT,
    showAddToCartNotification,
    showErrorNotification
}; 