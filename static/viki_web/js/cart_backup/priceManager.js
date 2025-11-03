/**
 * Price manager for cart
 * Fetches prices from API and manages price updates based on quantity
 */

import { updateCartSummary } from './summary.js';
import { updateItemTotal } from './calculation.js';

/**
 * Cache for volume prices
 * Structure: { itemId: { quantity1: price1, quantity2: price2, ... }, ... }
 */
const volumePricesCache = new Map();

/**
 * Fetches price from API for a specific item
 * @param {string} itemId - Item ID
 * @returns {Promise} - Promise with price data
 */
async function fetchItemPrice(itemId) {
    try {
        const response = await fetch(`/api/get-item-price/${itemId}/`);
        if (!response.ok) {
            throw new Error(`Error fetching price: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch price for item ${itemId}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Gets price for an item based on quantity
 * @param {string} itemId - Item ID
 * @param {number} quantity - Item quantity
 * @returns {number|null} - Price or null if not found
 */
function getItemPrice(itemId, quantity) {
    const volumePrices = volumePricesCache.get(itemId);
    
    // If no volume prices cached, return null
    if (!volumePrices) return null;
    
    // If standard price, return it
    if (volumePrices.standard) {
        return volumePrices.price;
    }
    
    // Find appropriate volume price
    const priceBreaks = volumePrices.prices;
    if (!priceBreaks || priceBreaks.length === 0) return null;
    
    // Sort price breaks by quantity in ascending order
    const sortedBreaks = [...priceBreaks].sort((a, b) => a.quantity - b.quantity);
    
    // Find the highest applicable price break
    let applicablePrice = null;
    for (const priceBreak of sortedBreaks) {
        if (quantity >= priceBreak.quantity) {
            applicablePrice = priceBreak.price;
        } else {
            break;
        }
    }
    
    // If no applicable price break found, use the lowest quantity price break
    if (applicablePrice === null && sortedBreaks.length > 0) {
        applicablePrice = sortedBreaks[0].price;
    }
    
    return applicablePrice;
}

/**
 * Updates price display for a cart item
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} price - New price
 */
function updatePriceDisplay(cartItem, price) {
    const priceElement = cartItem.querySelector('.cart-item__price-single-input');
    if (priceElement) {
        priceElement.value = price.toFixed(2);
    }
    
    // Use the calculation module to update all totals
    updateItemTotal(cartItem);
}

/**
 * Updates cart item in localStorage with new price
 * @param {string} itemId - Item ID
 * @param {number} price - New price
 */
function updateCartItemPrice(itemId, price) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].price = price;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

/**
 * Adds or removes promotion badge for a cart item
 * @param {HTMLElement} cartItem - Cart item element
 * @param {boolean} isPromotion - Whether the item is on promotion
 */
function updatePromotionBadge(cartItem, isPromotion) {
    // Check if promotion badge already exists
    let badge = cartItem.querySelector('.promotion-badge');
    
    if (isPromotion) {
        // Add badge if it doesn't exist
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'promotion-badge';
            badge.textContent = 'Акция';
            
            // Insert badge into cart item
            const infoElement = cartItem.querySelector('.cart-item__info');
            if (infoElement) {
                infoElement.insertBefore(badge, infoElement.firstChild);
            }
        }
    } else {
        // Remove badge if it exists
        if (badge) {
            badge.remove();
        }
    }
    
    // Also update promotion flag in localStorage
    updatePromotionFlagInLocalStorage(cartItem, isPromotion);
}

/**
 * Updates promotion flag in localStorage
 * @param {HTMLElement} cartItem - Cart item element
 * @param {boolean} isPromotion - Whether the item is on promotion
 */
function updatePromotionFlagInLocalStorage(cartItem, isPromotion) {
    const removeBtn = cartItem.querySelector('.cart-item__remove');
    if (!removeBtn || !removeBtn.dataset.id) return;
    
    const itemId = removeBtn.dataset.id;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].promotion = isPromotion;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

/**
 * Updates price for all cart items
 */
async function updateAllPrices() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    for (const cartItem of cartItems) {
        const removeBtn = cartItem.querySelector('.cart-item__remove');
        if (!removeBtn || !removeBtn.dataset.id) continue;
        
        const itemId = removeBtn.dataset.id;
        const priceData = await fetchItemPrice(itemId);
        
        if (priceData.success) {
            // Process based on price type
            if (priceData.standard_price) {
                // Standard price
                volumePricesCache.set(itemId, {
                    standard: true,
                    price: priceData.price,
                    promotion: priceData.promotion_price
                });
                
                // Update price display
                updatePriceDisplay(cartItem, priceData.price);
                
                // Update item in localStorage
                updateCartItemPrice(itemId, priceData.price);
                
                // Update promotion badge
                updatePromotionBadge(cartItem, priceData.promotion_price);
            } else {
                // Volume-based price
                volumePricesCache.set(itemId, {
                    standard: false,
                    prices: priceData.prices,
                    promotion: priceData.promotion_price
                });
                
                // Get quantity
                const quantityInput = cartItem.querySelector('.cart-item__quantity-input');
                const quantity = parseInt(quantityInput.value);
                
                // Get price for current quantity
                const price = getItemPrice(itemId, quantity);
                
                if (price !== null) {
                    // Update price display
                    updatePriceDisplay(cartItem, price);
                    
                    // Update item in localStorage
                    updateCartItemPrice(itemId, price);
                    
                    // Update promotion badge
                    updatePromotionBadge(cartItem, priceData.promotion_price);
                }
            }
        }
    }
    
    // Update cart summary
    updateCartSummary();
}

/**
 * Update price when quantity changes
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} newQuantity - New quantity value
 */
function updatePriceOnQuantityChange(cartItem, newQuantity) {
    const removeBtn = cartItem.querySelector('.cart-item__remove');
    if (!removeBtn || !removeBtn.dataset.id) return;
    
    const itemId = removeBtn.dataset.id;
    const volumePrices = volumePricesCache.get(itemId);
    
    // If no cached prices or standard price, no need to update
    if (!volumePrices || volumePrices.standard) return;
    
    // Get price for new quantity
    const price = getItemPrice(itemId, newQuantity);
    
    if (price !== null) {
        // Update price display
        updatePriceDisplay(cartItem, price);
        
        // Update item in localStorage
        updateCartItemPrice(itemId, price);
    }
}

/**
 * Initialize price management
 */
function initPriceManager() {
    // Add CSS for promotion badge
    addPromotionBadgeStyles();
    
    // First, update all prices
    updateAllPrices();
    
    // Listen for quantity changes
    document.addEventListener('cart:quantityChanged', function(e) {
        if (e.detail && e.detail.cartItem && e.detail.quantity) {
            updatePriceOnQuantityChange(e.detail.cartItem, e.detail.quantity);
        }
    });
}

/**
 * Adds CSS styles for promotion badge
 */
function addPromotionBadgeStyles() {
    if (!document.getElementById('promotion-badge-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'promotion-badge-styles';
        styleElement.textContent = `
            .promotion-badge {
                display: inline-block;
                padding: 4px 8px;
                background-color: #ff6b6b;
                color: white;
                font-weight: bold;
                border-radius: 4px;
                font-size: 12px;
                margin-right: 5px;
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

export { initPriceManager, updateAllPrices, getItemPrice }; 