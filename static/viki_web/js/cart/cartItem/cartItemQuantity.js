/**
 * Cart Item Quantity Module
 * Handles quantity changes in cart items
 */

import { updateCartItemQuantity, updateCartItemBranding } from '../cartStorage.js';
import { renderCartItem } from './cartItemRenderer.js';
import { registerModuleInit } from './eventDebugger.js';
import eventBus from '../eventBus.js';
import { QUANTITY_EVENTS } from './cartItemEvents.js';

// Флаг для отслеживания состояния инициализации
let isModuleInitialized = false;

/**
 * Initialize quantity handlers
 */
export function initQuantityInputHandlers() {
    // Регистрируем инициализацию
    registerModuleInit('cartItemQuantity.js', { phase: 'start' });
    
    // Подписываемся на события изменения количества
    if (!isModuleInitialized) {
        // Обработчик увеличения количества
        eventBus.subscribe(QUANTITY_EVENTS.INCREASE, handleQuantityIncrease);
        
        // Обработчик уменьшения количества
        eventBus.subscribe(QUANTITY_EVENTS.DECREASE, handleQuantityDecrease);
        
        // Обработчик прямого изменения количества (из поля ввода)
        eventBus.subscribe(QUANTITY_EVENTS.CHANGE, handleQuantityChange);
        
        // Подписываемся на события брендирования
        eventBus.subscribe('cart:branding:remove', handleBrandingRemove);
        eventBus.subscribe('cart:branding:toggle', handleBrandingToggle);
        
        isModuleInitialized = true;
    }
    
    // Регистрируем завершение инициализации
    registerModuleInit('cartItemQuantity.js', { phase: 'completed' });
}

/**
 * Handle quantity increase event
 * @param {Object} data - Event data {itemId, quantity, previousQuantity}
 */
function handleQuantityIncrease(data) {
    if (!data || !data.itemId) {
        return;
    }
    
    updateQuantity(data.itemId, data.quantity);
}

/**
 * Handle quantity decrease event
 * @param {Object} data - Event data {itemId, quantity, previousQuantity}
 */
function handleQuantityDecrease(data) {
    updateQuantity(data.itemId, data.quantity);
}

/**
 * Handle quantity change event (from input)
 * @param {Object} data - Event data {itemId, quantity, previousQuantity, source}
 */
function handleQuantityChange(data) {
    updateQuantity(data.itemId, data.quantity);
}

/**
 * Update item quantity in storage but do not render canvas immediately
 * @param {string} itemId - Item ID
 * @param {number} quantity - New quantity
 */
function updateQuantity(itemId, quantity) {
    // Обновляем только количество в хранилище
    // Перерисовка будет выполнена по событию PRICE_CALCULATION_COMPLETE
    updateCartItemQuantity(itemId, quantity);
}

/**
 * Handle branding remove event
 * @param {Object} data - Event data {itemId, brandingIndex}
 */
function handleBrandingRemove(data) {
    const { itemId, brandingIndex } = data;
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(item => item.id === itemId);
    
    if (item && item.branding && item.branding.length > brandingIndex) {
        // Remove branding item
        item.branding.splice(brandingIndex, 1);
        
        // Update storage
        updateCartItemBranding(itemId, item.branding);
        
        // Update canvas
        const canvas = document.querySelector(`.cart-item-canvas[data-item-id="${itemId}"]`);
        if (canvas) {
            renderCartItem(canvas, item);
        }
    }
}

/**
 * Handle branding toggle event
 * @param {Object} data - Event data {itemId, brandingIndex}
 */
function handleBrandingToggle(data) {
    const { itemId, brandingIndex } = data;
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(item => item.id === itemId);
    
    if (item && item.branding && item.branding.length > brandingIndex) {
        // Toggle second pass
        item.branding[brandingIndex].secondPass = !item.branding[brandingIndex].secondPass;
        
        // Update storage
        updateCartItemBranding(itemId, item.branding);
        
        // Update canvas
        const canvas = document.querySelector(`.cart-item-canvas[data-item-id="${itemId}"]`);
        if (canvas) {
            renderCartItem(canvas, item);
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initQuantityInputHandlers, 500);
});
