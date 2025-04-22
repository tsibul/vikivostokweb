/**
 * Cart Storage Module
 * Handles localStorage operations for cart data
 */

import eventBus from './eventBus.js';

// Storage key for cart items
const CART_STORAGE_KEY = 'cart';

// Events
export const STORAGE_EVENTS = {
    CART_UPDATED: 'cart:updated',
    CART_CLEARED: 'cart:cleared',
    CART_ITEM_ADDED: 'cart:item:added',
    CART_ITEM_REMOVED: 'cart:item:removed',
    CART_ITEM_UPDATED: 'cart:item:updated'
};

/**
 * Get cart items from storage
 * @returns {Array} Cart items
 */
export function getCartItems() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch (error) {
        console.error('Failed to get cart items from storage:', error);
        return [];
    }
}

/**
 * Save cart items to storage
 * @param {Array} items - Cart items to save
 */
export function saveCartItems(items) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        eventBus.publish(STORAGE_EVENTS.CART_UPDATED, items);
    } catch (error) {
        console.error('Failed to save cart items to storage:', error);
    }
}

/**
 * Add item to cart
 * @param {Object} item - Item to add
 */
export function addCartItem(item) {
    const items = getCartItems();
    
    // Check if item already exists
    const existingItemIndex = items.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
        // Update quantity if item exists
        items[existingItemIndex].quantity += item.quantity || 1;
        saveCartItems(items);
        eventBus.publish(STORAGE_EVENTS.CART_ITEM_UPDATED, {
            item: items[existingItemIndex],
            index: existingItemIndex
        });
    } else {
        // Add new item
        const newItem = {
            ...item,
            quantity: item.quantity || 1,
            branding: item.branding || []
        };
        
        items.push(newItem);
        saveCartItems(items);
        eventBus.publish(STORAGE_EVENTS.CART_ITEM_ADDED, {
            item: newItem,
            index: items.length - 1
        });
    }
    
    updateCartBadge();
    return items;
}

/**
 * Remove item from cart
 * @param {string|number} itemId - Item ID to remove
 */
export function removeCartItem(itemId) {
    const items = getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
        const removedItem = items[itemIndex];
        items.splice(itemIndex, 1);
        saveCartItems(items);
        
        eventBus.publish(STORAGE_EVENTS.CART_ITEM_REMOVED, {
            item: removedItem,
            index: itemIndex
        });
        
        updateCartBadge();
    }
    
    return items;
}

/**
 * Update item quantity
 * @param {string|number} itemId - Item ID to update
 * @param {number} quantity - New quantity
 */
export function updateCartItemQuantity(itemId, quantity) {
    const items = getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0 && quantity > 0) {
        items[itemIndex].quantity = quantity;
        saveCartItems(items);
        
        eventBus.publish(STORAGE_EVENTS.CART_ITEM_UPDATED, {
            item: items[itemIndex],
            index: itemIndex
        });
    }
    
    return items;
}

/**
 * Update item branding
 * @param {string|number} itemId - Item ID to update
 * @param {Array} branding - Branding array
 */
export function updateCartItemBranding(itemId, branding) {
    const items = getCartItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
        items[itemIndex].branding = branding || [];
        saveCartItems(items);
        
        eventBus.publish(STORAGE_EVENTS.CART_ITEM_UPDATED, {
            item: items[itemIndex],
            index: itemIndex
        });
    }
    
    return items;
}

/**
 * Clear cart
 */
export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    eventBus.publish(STORAGE_EVENTS.CART_CLEARED, []);
    updateCartBadge();
}

/**
 * Update cart badge count
 */
export function updateCartBadge() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = getCartItems();
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

/**
 * Get cart item count
 * @returns {number} Number of items in cart
 */
export function getCartItemCount() {
    return getCartItems().length;
}

/**
 * Get cart item by ID
 * @param {string|number} itemId - Item ID
 * @returns {Object|null} Cart item or null if not found
 */
export function getCartItemById(itemId) {
    const items = getCartItems();
    return items.find(item => item.id === itemId) || null;
}

// Initialize the cart badge on module load
document.addEventListener('DOMContentLoaded', updateCartBadge);

// Подписываемся на событие добавления товара
eventBus.subscribe('cart:add', (product) => {
    console.log('Received cart:add event, adding product to cart:', product);
    addCartItem(product);
});
