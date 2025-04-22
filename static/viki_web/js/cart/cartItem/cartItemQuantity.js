/**
 * Cart Item Quantity Module
 * Handles quantity changes in cart items
 */

import { updateCartItemQuantity, updateCartItemBranding } from '../cartStorage.js';
import { renderCartItem } from './cartItemRenderer.js';
import { registerModuleInit } from './eventDebugger.js';
import eventBus from '../eventBus.js';
import { QUANTITY_EVENTS } from './cartItemEvents.js';

// Регистрируем загрузку модуля
console.log('Loading cartItemQuantity.js module - QUANTITY BUSINESS LOGIC');

// Флаг для отслеживания состояния инициализации
let isModuleInitialized = false;

/**
 * Initialize quantity handlers
 */
export function initQuantityInputHandlers() {
    console.log('Initializing quantity handlers [cartItemQuantity.js]');
    
    // Регистрируем инициализацию
    registerModuleInit('cartItemQuantity.js', { phase: 'start' });
    
    // Подписываемся на события изменения количества
    if (!isModuleInitialized) {
        console.log('DEBUG-QTY: Subscribing to events for the first time');
        
        // Обработчик увеличения количества
        console.log('DEBUG-QTY: Subscribing to INCREASE event:', QUANTITY_EVENTS.INCREASE);
        eventBus.subscribe(QUANTITY_EVENTS.INCREASE, handleQuantityIncrease);
        
        // Обработчик уменьшения количества
        console.log('DEBUG-QTY: Subscribing to DECREASE event:', QUANTITY_EVENTS.DECREASE);
        eventBus.subscribe(QUANTITY_EVENTS.DECREASE, handleQuantityDecrease);
        
        // Обработчик прямого изменения количества (из поля ввода)
        console.log('DEBUG-QTY: Subscribing to CHANGE event:', QUANTITY_EVENTS.CHANGE);
        eventBus.subscribe(QUANTITY_EVENTS.CHANGE, handleQuantityChange);
        
        // Подписываемся на события брендирования
        eventBus.subscribe('cart:branding:remove', handleBrandingRemove);
        eventBus.subscribe('cart:branding:toggle', handleBrandingToggle);
        
        console.log('Subscribed to quantity events');
        isModuleInitialized = true;
    } else {
        console.log('DEBUG-QTY: Handlers already initialized, skipping subscription');
    }
    
    // Проверяем, какие события зарегистрированы в eventBus
    console.log('DEBUG-QTY: Current eventBus state:', eventBus);
    
    // Регистрируем завершение инициализации
    registerModuleInit('cartItemQuantity.js', { phase: 'completed' });
}

/**
 * Handle quantity increase event
 * @param {Object} data - Event data {itemId, quantity, previousQuantity}
 */
function handleQuantityIncrease(data) {
    console.log('DEBUG-QTY: handleQuantityIncrease called with data:', data);
    
    if (!data || !data.itemId) {
        console.error('DEBUG-QTY: Invalid data received in handleQuantityIncrease');
        return;
    }
    
    console.log(`🔼 Processing quantity increase for item ${data.itemId}: ${data.previousQuantity} -> ${data.quantity}`);
    
    try {
        updateQuantity(data.itemId, data.quantity);
        console.log('DEBUG-QTY: updateQuantity completed successfully');
    } catch (e) {
        console.error('DEBUG-QTY: Error in updateQuantity:', e);
    }
}

/**
 * Handle quantity decrease event
 * @param {Object} data - Event data {itemId, quantity, previousQuantity}
 */
function handleQuantityDecrease(data) {
    console.log(`🔽 Processing quantity decrease for item ${data.itemId}: ${data.previousQuantity} -> ${data.quantity}`);
    updateQuantity(data.itemId, data.quantity);
}

/**
 * Handle quantity change event (from input)
 * @param {Object} data - Event data {itemId, quantity, previousQuantity, source}
 */
function handleQuantityChange(data) {
    console.log(`🔄 Processing quantity change for item ${data.itemId}: ${data.previousQuantity} -> ${data.quantity} (source: ${data.source || 'unknown'})`);
    updateQuantity(data.itemId, data.quantity);
}

/**
 * Update item quantity and render canvas
 * @param {string} itemId - Item ID
 * @param {number} quantity - New quantity
 */
function updateQuantity(itemId, quantity) {
    // Обновляем количество в хранилище
    updateCartItemQuantity(itemId, quantity);
    
    // Находим canvas для обновления
    const canvas = document.querySelector(`.cart-item-canvas[data-item-id="${itemId}"]`);
    if (canvas) {
        // Получаем обновленные данные товара
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cartItems.find(item => item.id === itemId);
        
        if (item) {
            // Перерисовываем канвас
            renderCartItem(canvas, item);
        }
    }
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
    console.log('DOM loaded, initializing quantity handlers');
    setTimeout(initQuantityInputHandlers, 500);
});
