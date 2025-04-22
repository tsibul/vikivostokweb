/**
 * Module for cart item removal
 */

import { updateCartSummary } from './summary.js';
import { showEmptyCart } from './rendering.js';

/**
 * Initializes cart item remove buttons
 */
export function initCartItemRemove() {
    const removeButtons = document.querySelectorAll('.cart-item__remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            const itemId = this.dataset.id;
            
            // Remove item from localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const updatedCart = cart.filter(item => item.id != itemId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            
            // Update cart badge
            if (window.CartManager) {
                window.CartManager.updateBadge();
            }
            
            // Remove item from DOM
            cartItem.remove();
            updateCartSummary();
            
            // Check for empty cart
            const cartItems = document.querySelectorAll('.cart-item');
            if (cartItems.length === 0) {
                showEmptyCart();
            }
        });
    });
} 