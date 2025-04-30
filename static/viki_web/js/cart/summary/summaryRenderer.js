/**
 * Summary Renderer Module
 * Handles rendering cart summary
 */

import eventBus from '../eventBus.js';
import {STORAGE_EVENTS} from '../cartStorage.js';
import {formatPrice} from '../pricing/priceFormatter.js';

/**
 * Calculate cart summary data
 * @returns {Object} Summary data with total items, subtotal, branding total, and grand total
 */
export function calculateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    let totalItems = 0;
    let subtotal = 0;
    let brandingTotal = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        
        // Use discountPrice if available, otherwise fall back to regular price
        const priceToUse = item.discountPrice !== undefined ? item.discountPrice : item.price;
        subtotal += priceToUse * item.quantity;

        // Calculate branding total
        if (item.branding && item.branding.length > 0) {
            brandingTotal += item.branding.reduce((sum, b) => {
                const secondPassMultiplier = b.secondPass ? 1.3 : 1;
                const currentPrice = b.price * b.colors * secondPassMultiplier;
                return sum + (currentPrice * item.quantity);
            }, 0);
        }
    });

    const grandTotal = subtotal + brandingTotal;

    return {
        totalItems,
        subtotal,
        brandingTotal,
        grandTotal
    };
}

/**
 * Update cart summary
 * Updates the existing HTML structure with calculated values
 */
export function updateSummary() {
    const summaryElement = document.querySelector('.cart-summary');
    const emptyCartElement = document.querySelector('.cart-empty');

    if (!summaryElement) return;

    const {totalItems, subtotal, brandingTotal, grandTotal} = calculateSummary();

    // Check if cart is empty
    if (totalItems === 0) {
        // Hide summary and show empty cart message
        summaryElement.classList.add('item-hidden');
        if (emptyCartElement) {
            emptyCartElement.classList.remove('item-hidden');
        }
        return;
    }

    // Show summary and hide empty cart message
    summaryElement.classList.remove('item-hidden');
    if (emptyCartElement) {
        emptyCartElement.classList.add('item-hidden');
    }

    // Update summary values using the existing HTML structure
    const itemsInput = summaryElement.querySelector('.cart-summary__items-input');
    const subtotalInput = summaryElement.querySelector('.cart-summary__subtotal-input');
    const brandingInput = summaryElement.querySelector('.cart-summary__branding-total-input');
    const totalInput = summaryElement.querySelector('.cart-summary__total-input');

    if (itemsInput) {
        itemsInput.textContent = totalItems;
        itemsInput.dataset.value = totalItems;
    }

    if (subtotalInput) {
        subtotalInput.textContent = formatPrice(subtotal);
        subtotalInput.dataset.value = subtotal.toFixed(2);
    }

    if (brandingInput) {
        brandingInput.textContent = formatPrice(brandingTotal);
        brandingInput.dataset.value = brandingTotal.toFixed(2);
    }

    if (totalInput) {
        totalInput.textContent = formatPrice(grandTotal);
        totalInput.dataset.value = grandTotal.toFixed(2);
    }
}

/**
 * Add event handlers for cart summary buttons
 */
export function initSummaryEvents() {
    const continueButton = document.querySelector('.cart-summary__continue');
    const checkoutButton = document.querySelector('.cart-summary__checkout');

    if (continueButton) {
        continueButton.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    // if (checkoutButton) {
    //     checkoutButton.addEventListener('click', () => {
    //         window.location.href = '/checkout';
    //     });
    // }
}

/**
 * Initialize summary module
 */
export function initSummary() {
    // Update summary initially
    updateSummary();

    // Initialize button events
    initSummaryEvents();

    // Subscribe to cart update events
    eventBus.subscribe(STORAGE_EVENTS.CART_UPDATED, updateSummary);
}
