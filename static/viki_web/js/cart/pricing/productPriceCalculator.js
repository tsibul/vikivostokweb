/**
 * Product Price Calculator Module
 * Handles calculating product prices based on quantity
 */

import eventBus from '../eventBus.js';
import { STORAGE_EVENTS } from '../cartStorage.js';

// Cache for price data by item ID
const priceCache = new Map();

/**
 * Initialize price calculator
 * Sets up listeners for cart item updates
 */
export function initPriceCalculator() {

    // Listen for quantity changes
    eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_UPDATED, async (data) => {
        if (data && data.item) {
            await updateProductPrice(data.item.id, data.item.quantity);
        }
    });
}

/**
 * Fetch price data for a product
 * @param {string|number} itemId - Item ID
 * @returns {Promise<Object>} - Price data
 */
export async function fetchProductPrice(itemId) {
    // Check cache first
    if (priceCache.has(itemId)) {
        return priceCache.get(itemId);
    }
    
    try {
        const response = await fetch(`/api/get-item-price/${itemId}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch product price');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Store in cache
            priceCache.set(itemId, data);
            return data;
        } else {
            console.error('Error fetching product price:', data.error || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Error fetching product price:', error);
        return null;
    }
}

/**
 * Calculate product price based on quantity
 * @param {Object} priceData - Price data from API
 * @param {number} quantity - Product quantity
 * @returns {number} - Calculated price
 */
export function calculateProductPrice(priceData, quantity) {
    if (!priceData) {
        return 0;
    }
    
    // If standard price (fixed price)
    if (priceData.standard_price) {
        return priceData.price;
    }
    
    // If volume-based pricing
    if (priceData.prices && priceData.prices.length > 0) {
        // Sort prices by quantity in ascending order
        const sortedPrices = [...priceData.prices].sort((a, b) => a.quantity - b.quantity);
        
        // Начинаем с цены нижнего порога (первого в отсортированном массиве)
        let currentPrice = sortedPrices[0].price;
        
        // Идем по всем порогам и проверяем, превышает ли количество порог
        for (let i = 0; i < sortedPrices.length; i++) {
            // Если количество больше или равно текущему порогу
            if (quantity >= sortedPrices[i].quantity) {
                // Проверяем, есть ли следующий порог
                if (i + 1 < sortedPrices.length) {
                    // Если есть следующий порог, берем его цену
                    currentPrice = sortedPrices[i + 1].price;
                } else {
                    // Если следующего порога нет, оставляем текущую цену
                    // (цену последнего порога)
                    currentPrice = sortedPrices[i].price;
                }
            } else {
                // Если количество меньше текущего порога, прекращаем поиск
                break;
            }
        }
        
        return currentPrice;
    }
    
    return 0;
}

/**
 * Update product price when quantity changes
 * @param {string|number} itemId - Cart item ID
 * @param {number} quantity - New quantity
 */
export async function updateProductPrice(itemId, quantity) {
    // Get price data
    const priceData = await fetchProductPrice(itemId);
    
    if (!priceData) {
        return;
    }
    
    // Calculate new price
    const newPrice = calculateProductPrice(priceData, quantity);
    
    // Update price in cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
        // Check if price actually changed
        if (cart[itemIndex].price !== newPrice) {
            cart[itemIndex].price = newPrice;
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Publish update event
            eventBus.publish(STORAGE_EVENTS.CART_ITEM_UPDATED, {
                item: cart[itemIndex],
                index: itemIndex
            });
        }
    }
}

// Export cache for debugging/monitoring
export { priceCache };
