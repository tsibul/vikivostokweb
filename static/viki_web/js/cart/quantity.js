/**
 * Module for cart quantity management
 */

import { updateCartSummary } from './summary.js';
import { updateItemTotal } from './calculation.js';

/**
 * Dispatches custom event for quantity change
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} quantity - New quantity value
 */
function dispatchQuantityChangeEvent(cartItem, quantity) {
    // Dispatch custom event
    const event = new CustomEvent('cart:quantityChanged', {
        bubbles: true,
        detail: {
            cartItem: cartItem,
            quantity: quantity
        }
    });
    document.dispatchEvent(event);
    
    // Update cart in localStorage
    updateCartInLocalStorage(cartItem, quantity);
}

/**
 * Updates cart item in localStorage with new quantity
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} quantity - New quantity value
 */
function updateCartInLocalStorage(cartItem, quantity) {
    const removeBtn = cartItem.querySelector('.cart-item__remove');
    if (!removeBtn || !removeBtn.dataset.id) return;
    
    const itemId = removeBtn.dataset.id;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

/**
 * Initializes quantity buttons in cart
 */
export function initCartQuantity() {
    const decreaseButtons = document.querySelectorAll('.cart-item__quantity-decrease');
    const increaseButtons = document.querySelectorAll('.cart-item__quantity-increase');
    const quantityInputs = document.querySelectorAll('.cart-item__quantity-input');

    // Handle decrease buttons
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.cart-item__quantity-input');
            let value = parseInt(input.value);
            if (value > parseInt(input.min)) {
                value -= 1;
                input.value = value;
                const cartItem = this.closest('.cart-item');
                updateItemTotal(cartItem);
                updateCartSummary();
                
                // Dispatch event for price manager
                dispatchQuantityChangeEvent(cartItem, value);
            }
        });
    });

    // Handle increase buttons
    increaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.cart-item__quantity-input');
            let value = parseInt(input.value);
            value += 1;
            input.value = value;
            const cartItem = this.closest('.cart-item');
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Dispatch event for price manager
            dispatchQuantityChangeEvent(cartItem, value);
        });
    });

    // Handle input changes
    quantityInputs.forEach(input => {
        input.addEventListener('change', function () {
            let value = parseInt(this.value);
            if (value < parseInt(this.min)) {
                value = parseInt(this.min);
                this.value = value;
            }
            const cartItem = this.closest('.cart-item');
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Dispatch event for price manager
            dispatchQuantityChangeEvent(cartItem, value);
        });
    });
} 