/**
 * Cart UI Module
 * Handles cart UI updates and interactions
 */

import eventBus from './eventBus.js';
import { EVENTS } from './events.js';
import { formatPrice } from './pricing/priceFormatter.js';
import { debug } from './utils/debug.js';

// UI Selectors
const SELECTORS = {
    CART_COUNTER: '.cart-counter',
    CART_TOTAL: '.cart-total',
    CART_ITEMS: '.cart-items',
    CART_ITEM: '.cart-item',
    QUANTITY_INPUT: '.quantity-input',
    REMOVE_BUTTON: '.remove-button',
    BRANDING_SELECT: '.branding-select'
};

/**
 * Update cart counter in UI
 * @param {number} count - New item count
 */
export function updateCartCounter(count) {
    const counter = document.querySelector(SELECTORS.CART_COUNTER);
    if (counter) {
        counter.textContent = count.toString();
        debug.debug('Cart counter updated:', count);
    }
}

/**
 * Update cart total in UI
 * @param {number} total - New total price
 */
export function updateCartTotal(total) {
    const totalElement = document.querySelector(SELECTORS.CART_TOTAL);
    if (totalElement) {
        totalElement.textContent = formatPrice(total);
        debug.debug('Cart total updated:', total);
    }
}

/**
 * Update cart items list in UI
 * @param {Array} items - Cart items
 */
export function updateCartItems(items) {
    const cartItems = document.querySelector(SELECTORS.CART_ITEMS);
    if (!cartItems) return;
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add new items
    items.forEach(item => {
        const itemElement = createCartItemElement(item);
        cartItems.appendChild(itemElement);
    });
    
    debug.debug('Cart items updated:', items);
}

/**
 * Create cart item element
 * @param {Object} item - Cart item data
 * @returns {HTMLElement} Cart item element
 */
function createCartItemElement(item) {
    const element = document.createElement('div');
    element.classList.add('cart-item');
    element.dataset.itemId = item.id;
    
    // Add item content (customize based on your needs)
    element.innerHTML = `
        <div class="item-details">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">${formatPrice(item.price)}</p>
        </div>
        <div class="item-controls">
            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
            <select class="branding-select">
                ${item.availableBranding.map(brand => 
                    `<option value="${brand.id}" ${item.branding.includes(brand.id) ? 'selected' : ''}>
                        ${brand.name}
                    </option>`
                ).join('')}
            </select>
            <button class="remove-button">Remove</button>
        </div>
    `;
    
    // Add event listeners
    addItemEventListeners(element);
    
    return element;
}

/**
 * Add event listeners to cart item element
 * @param {HTMLElement} element - Cart item element
 */
function addItemEventListeners(element) {
    const itemId = element.dataset.itemId;
    
    // Quantity input
    const quantityInput = element.querySelector(SELECTORS.QUANTITY_INPUT);
    if (quantityInput) {
        quantityInput.addEventListener('change', (event) => {
            const quantity = parseInt(event.target.value, 10);
            eventBus.publish(EVENTS.CART.ITEM_QUANTITY_UPDATED, { itemId, quantity });
        });
    }
    
    // Remove button
    const removeButton = element.querySelector(SELECTORS.REMOVE_BUTTON);
    if (removeButton) {
        removeButton.addEventListener('click', () => {
            eventBus.publish(EVENTS.CART.ITEM_REMOVED, { itemId });
        });
    }
    
    // Branding select
    const brandingSelect = element.querySelector(SELECTORS.BRANDING_SELECT);
    if (brandingSelect) {
        brandingSelect.addEventListener('change', () => {
            const selectedOptions = Array.from(brandingSelect.selectedOptions);
            const branding = selectedOptions.map(option => option.value);
            eventBus.publish(EVENTS.CART.ITEM_BRANDING_UPDATED, { itemId, branding });
        });
    }
}

/**
 * Show loading state in UI
 */
export function showLoading() {
    document.body.classList.add('cart-loading');
    eventBus.publish(EVENTS.UI.UPDATE_STARTED);
}

/**
 * Hide loading state in UI
 */
export function hideLoading() {
    document.body.classList.remove('cart-loading');
    eventBus.publish(EVENTS.UI.UPDATE_COMPLETED);
}

/**
 * Show error message in UI
 * @param {string} message - Error message to display
 */
export function showError(message) {
    // Implement error display logic (e.g., toast notification)
    debug.error('Cart error:', message);
    eventBus.publish(EVENTS.UI.ERROR, { message });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart UI
    updateCartCounter(cartService.getItemCount());
    updateCartTotal(cartService.getTotal());
    updateCartItems(cartService.getItems());
}); 