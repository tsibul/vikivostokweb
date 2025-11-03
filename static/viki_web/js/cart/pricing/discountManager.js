/**
 * Discount Manager Module
 * Handles fetching, applying and resetting volume discounts in cart
 */

import eventBus from '../eventBus.js';
import { STORAGE_EVENTS } from '../cartStorage.js';
import { priceCache, fetchProductPrice } from './productPriceCalculator.js';
import { formatPrice } from './priceFormatter.js';

// Constants for discount-related events
const DISCOUNT_EVENTS = {
    DISCOUNTS_APPLIED: 'cart:discounts:applied',
    DISCOUNTS_RESET: 'cart:discounts:reset',
    DISCOUNTS_UI_UPDATE: 'cart:discounts:ui:update'
};

// Cache for volume discounts data
let discountsCache = null;

/**
 * Initialize discount manager
 * Sets up listeners for cart updates and fetches initial discounts
 */
export async function initDiscountManager() {
    // Fetch discounts on initialization
    await fetchVolumeDiscounts();
    
    // Subscribe to cart update events to reset discounts
    eventBus.subscribe(STORAGE_EVENTS.CART_UPDATED, handleCartUpdate);
    eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_UPDATED, handleCartItemUpdate);
}

/**
 * Fetch volume discounts from server
 * @returns {Promise<Object>} - Discount data
 */
export async function fetchVolumeDiscounts() {
    try {
        const response = await fetch('/api/volume-discounts/');
        if (!response.ok) {
            throw new Error('Failed to fetch volume discounts');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Store in cache and localStorage
            discountsCache = data.discounts;
            saveDiscountsToStorage(data.discounts);
            return data.discounts;
        } else {
            console.error('Error fetching volume discounts:', data.error || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Error fetching volume discounts:', error);
        return null;
    }
}

/**
 * Save discounts to localStorage
 * @param {Array} discounts - Discount data
 */
function saveDiscountsToStorage(discounts) {
    localStorage.setItem('volumeDiscounts', JSON.stringify(discounts));
}

/**
 * Get discounts from localStorage
 * @returns {Array} - Discount data
 */
function getDiscountsFromStorage() {
    // Try to get from cache first
    if (discountsCache) {
        return discountsCache;
    }
    
    // Get from localStorage
    const discounts = localStorage.getItem('volumeDiscounts');
    if (discounts) {
        try {
            discountsCache = JSON.parse(discounts);
            return discountsCache;
        } catch (e) {
            console.error('Error parsing volume discounts from localStorage:', e);
        }
    }
    
    // Fallback to fetching from server
    fetchVolumeDiscounts();
    return [];
}

/**
 * Calculate total price for items with standard price (not volume-based)
 * @returns {number} - Total price
 */
function calculateStandardPriceItemsTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let totalStandardPrice = 0;
    
    cart.forEach(item => {
        // Check if item has standard price
        const itemPriceData = priceCache.get(Number.parseInt(item.id));
        
        if (itemPriceData && itemPriceData.standard_price) {
            // Add item price to total
            totalStandardPrice += item.price * item.quantity;
            
            // Add branding costs if any
            if (item.branding && item.branding.length > 0) {
                item.branding.forEach(branding => {
                    const secondPassMultiplier = branding.secondPass ? 1.3 : 1;
                    const brandingPrice = Math.round((branding.price * branding.colors * secondPassMultiplier) * 100) / 100;
                    totalStandardPrice += brandingPrice * item.quantity;
                });
            }
        }
    });
    
    return totalStandardPrice;
}

/**
 * Find applicable discount based on total price
 * @param {number} totalPrice - Total price for standard price items
 * @returns {Object|null} - Applicable discount or null
 */
function findApplicableDiscount(totalPrice) {
    const discounts = getDiscountsFromStorage();
    if (!discounts || discounts.length === 0) {
        return null;
    }
    
    // Sort discounts by volume in ascending order
    const sortedDiscounts = [...discounts].sort((a, b) => a.volume - b.volume);
    
    // Find the highest applicable discount
    let applicableDiscount = null;
    
    for (const discount of sortedDiscounts) {
        if (totalPrice >= discount.volume) {
            applicableDiscount = discount;
        } else {
            // Stop if we've passed the applicable volume range
            break;
        }
    }
    
    return applicableDiscount;
}

/**
 * Apply discounts to cart items with standard price
 * @returns {Promise<boolean>} - Success status
 */
export async function applyDiscountsToItems() {
    // Убедимся, что для всех товаров в корзине получены данные о ценах
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Получаем данные о ценах для всех товаров, которых ещё нет в кэше
    const fetchPromises = [];
    
    for (const item of cart) {
        const itemId = Number.parseInt(item.id);
        if (!priceCache.has(itemId)) {
            // Добавляем промис для получения данных о цене
            fetchPromises.push(fetchProductPrice(itemId));
        }
    }
    
    // Ждем, пока все данные будут получены
    if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises);
    }
    
    // Теперь рассчитываем общую сумму стандартных товаров
    const totalStandardPrice = calculateStandardPriceItemsTotal();
    
    // Find applicable discount
    const discount = findApplicableDiscount(totalStandardPrice);
    
    if (!discount) {
        console.log('No applicable discounts found');
        return false;
    }
    
    // Применяем скидки к стандартным товарам
    let discountsApplied = false;
    const discountInput = document.querySelector(`input[name="discount"]`);
    discountInput.value = Math.round(discount.discount * 10000) / 10000;
    
    // Apply discount to items with standard price
    cart.forEach(item => {
        const itemPriceData = priceCache.get(Number.parseInt(item.id));
        
        if (itemPriceData && itemPriceData.standard_price) {
            // Calculate discounted price - rounded to 2 decimal places
            const discountedPrice = Math.round((item.price * discount.discount) * 100) / 100;
            
            // Update item with discounted price
            item.discountPrice = discountedPrice;
            discountsApplied = true;
        } else {
            // Make sure non-standard items use regular price
            item.discountPrice = item.price;
        }
    });
    
    // Save updated cart to localStorage
    if (discountsApplied) {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Publish event that discounts were applied
        eventBus.publish(DISCOUNT_EVENTS.DISCOUNTS_APPLIED, { 
            cart, 
            discount,
            totalStandardPrice
        });
        
        // Publish a specific event for UI update
        eventBus.publish(DISCOUNT_EVENTS.DISCOUNTS_UI_UPDATE, {
            timestamp: Date.now()
        });
        
        return true;
    }
    
    return false;
}

/**
 * Reset all discount prices to base prices
 */
export function resetDiscountPrices() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let updated = false;
    
    cart.forEach(item => {
        if (item.discountPrice !== item.price) {
            item.discountPrice = item.price;
            updated = true;
        }
    });
    
    if (updated) {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Publish event that discounts were reset
        eventBus.publish(DISCOUNT_EVENTS.DISCOUNTS_RESET, { cart });
    }
}

/**
 * Handle cart item update - reset discounts
 */
function handleCartItemUpdate() {
    resetDiscountPrices();
}

/**
 * Handle cart update - reset discounts
 */
function handleCartUpdate() {
    resetDiscountPrices();
}

// Export constants and main functions
export { DISCOUNT_EVENTS }; 