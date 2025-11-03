/**
 * Cart Service Module
 * Provides business logic for cart operations
 */

import eventBus from './eventBus.js';
import { debug } from './utils/debug.js';
import { EVENTS } from './events.js';
import * as storage from './cartStorage.js';

class CartService {
    constructor() {
        this.items = [];
        this.loadCart();
    }
    
    /**
     * Load cart data from storage
     */
    loadCart() {
        this.items = storage.loadCart();
        debug.debug('Cart loaded:', this.items);
        eventBus.publish(EVENTS.CART.LOADED, { items: this.items });
    }
    
    /**
     * Save current cart state to storage
     */
    saveCart() {
        storage.saveCart(this.items);
    }
    
    /**
     * Get all cart items
     * @returns {Array} Cart items
     */
    getItems() {
        return this.items;
    }
    
    /**
     * Get cart item by ID
     * @param {string} itemId - Item ID to find
     * @returns {Object|null} Found item or null
     */
    getItemById(itemId) {
        return this.items.find(item => item.id === itemId) || null;
    }
    
    /**
     * Get total number of items in cart
     * @returns {number} Total items count
     */
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    /**
     * Add or update item in cart
     * @param {Object} item - Item to add/update
     */
    updateItem(item) {
        const index = this.items.findIndex(i => i.id === item.id);
        
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...item };
        } else {
            this.items.push(item);
        }
        
        this.saveCart();
        eventBus.publish(EVENTS.CART.ITEM_UPDATED, { item });
    }
    
    /**
     * Remove item from cart
     * @param {string} itemId - ID of item to remove
     */
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        eventBus.publish(EVENTS.CART.ITEM_REMOVED, { itemId });
    }
    
    /**
     * Update item quantity
     * @param {string} itemId - Item ID
     * @param {number} quantity - New quantity
     */
    updateItemQuantity(itemId, quantity) {
        const item = this.getItemById(itemId);
        
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            eventBus.publish(EVENTS.CART.ITEM_QUANTITY_UPDATED, { itemId, quantity });
        }
    }
    
    /**
     * Update item branding
     * @param {string} itemId - Item ID
     * @param {Array} branding - New branding array
     */
    updateItemBranding(itemId, branding) {
        const item = this.getItemById(itemId);
        
        if (item) {
            item.branding = branding;
            this.saveCart();
            eventBus.publish(EVENTS.CART.ITEM_BRANDING_UPDATED, { itemId, branding });
        }
    }
    
    /**
     * Clear all items from cart
     */
    clearCart() {
        this.items = [];
        storage.clearCart();
        eventBus.publish(EVENTS.CART.CLEARED);
    }
}

// Create and export singleton instance
export const cartService = new CartService(); 