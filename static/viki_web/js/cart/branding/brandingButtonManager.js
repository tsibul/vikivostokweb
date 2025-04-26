/**
 * Branding Button Manager Module
 * Handles the state of branding buttons based on availability
 */

import eventBus from '../eventBus.js';
import { fetchPrintOpportunities } from './brandingOptionsManager.js';
import { getCartItem } from "../storage/cartStorage.js";
import { isAnyBrandingAvailable } from './brandingAdd.js';

// Cache for button states to avoid unnecessary DOM updates
const buttonStateCache = new Map();

/**
 * Initialize branding button manager
 * Subscribe to relevant cart events
 */
export function initBrandingButtonManager() {
    // Subscribe to cart events
    eventBus.subscribe('cart:updated', updateAllBrandingButtons);
    eventBus.subscribe('cart:item:added', (data) => updateBrandingButton(data.item.id));
    eventBus.subscribe('cart:item:updated', (data) => updateBrandingButton(data.item.id));
    eventBus.subscribe('cart:item:removed', clearButtonState);
    
    // Custom event for branding removal if implemented
    eventBus.subscribe('cart:branding:removed', (data) => updateBrandingButton(data.itemId));
    
    // Initial update of all buttons
    document.addEventListener('DOMContentLoaded', updateAllBrandingButtons);
}

/**
 * Update all branding buttons in the cart
 */
async function updateAllBrandingButtons() {
    const brandingButtons = document.querySelectorAll('.branding-add-btn');
    
    for (const button of brandingButtons) {
        const itemId = button.dataset.itemId;
        if (itemId) {
            await updateBrandingButton(itemId);
        }
    }
}

/**
 * Clear button state from cache when an item is removed
 * @param {Object} data - Event data
 */
function clearButtonState(data) {
    if (data && data.item && data.item.id) {
        buttonStateCache.delete(data.item.id);
    }
}

/**
 * Update a specific branding button based on item ID
 * @param {string|number} itemId - Cart item ID
 */
async function updateBrandingButton(itemId) {
    // Find the button in the DOM
    const button = document.querySelector(`.branding-add-btn[data-item-id="${itemId}"]`);
    if (!button) return;
    
    // Get cart item and its branding
    const cartItem = getCartItem(itemId);
    if (!cartItem) return;
    
    const existingBranding = cartItem.branding || [];
    
    // Check if we have cached state
    if (buttonStateCache.has(itemId)) {
        const cachedState = buttonStateCache.get(itemId);
        updateButtonState(button, cachedState.isAvailable, cachedState.goodsId);
        return;
    }
    
    // Fetch opportunities and check availability
    try {
        const opportunities = await fetchPrintOpportunities(cartItem.goodsId);
        const isAvailable = isAnyBrandingAvailable(opportunities, existingBranding);
        
        // Cache the result
        buttonStateCache.set(itemId, {
            isAvailable, 
            goodsId: cartItem.goodsId
        });
        
        // Update button
        updateButtonState(button, isAvailable, cartItem.goodsId);
    } catch (error) {
        console.error('Error updating branding button:', error);
        // Default to unavailable if there's an error
        updateButtonState(button, false, cartItem.goodsId);
    }
}

/**
 * Update button state in the DOM
 * @param {HTMLElement} button - Button element
 * @param {boolean} isAvailable - Whether branding is available
 * @param {string|number} goodsId - Goods ID (for data attribute)
 */
function updateButtonState(button, isAvailable, goodsId) {
    if (isAvailable) {
        button.textContent = 'Добавить брендирование';
        button.classList.remove('branding-add-btn__disabled');
        button.removeAttribute('disabled');
    } else {
        button.textContent = 'Для данного товара исчерпаны опции брендирования';
        button.classList.add('branding-add-btn__disabled');
        button.setAttribute('disabled', 'disabled');
    }
    
    // Update data attributes
    button.dataset.goodsId = goodsId;
}

// Export the initialization function
export default initBrandingButtonManager; 