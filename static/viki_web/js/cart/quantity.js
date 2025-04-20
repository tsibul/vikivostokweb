/**
 * Module for cart quantity management
 */

import { updateCartSummary } from './summary.js';
import { updateItemTotal } from './calculation.js';

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
                input.value = value - 1;
                updateItemTotal(this.closest('.cart-item'));
                updateCartSummary();
            }
        });
    });

    // Handle increase buttons
    increaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.cart-item__quantity-input');
            let value = parseInt(input.value);
            input.value = value + 1;
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
        });
    });

    // Handle input changes
    quantityInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (parseInt(this.value) < parseInt(this.min)) {
                this.value = this.min;
            }
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
        });
    });
} 