/**
 * Module for cart price calculations
 */

import { formatPrice } from './utils.js';

/**
 * Updates the total price for a cart item and all calculations
 * @param {HTMLElement} cartItem - Cart item element
 */
export function updateItemTotal(cartItem) {
    // Get item quantity
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    
    // Get item price
    let price = 0;
    const priceInput = cartItem.querySelector('.cart-item__price-single-input');
    
    if (priceInput) {
        price = parseFloat(priceInput.value);
    } else {
        // For backward compatibility
        const priceText = cartItem.querySelector('.cart-item__price-single')?.textContent;
        if (priceText) {
            price = parseFloat(priceText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Calculate items cost without branding
    const itemTotal = price * quantity;
    
    // Update item total display
    const totalPriceInput = cartItem.querySelector('.cart-item__total-price-input');
    if (totalPriceInput) {
        totalPriceInput.value = itemTotal.toFixed(2);
    } else {
        // For backward compatibility
        const totalPriceElement = cartItem.querySelector('.cart-item__total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = formatPrice(itemTotal.toFixed(0)) + ' руб.';
        }
    }
    
    // Update branding prices
    updateBrandingPrices(cartItem);
    
    // Update final item total with branding
    updateItemFinalTotal(cartItem, itemTotal);
}

/**
 * Updates branding prices for a cart item
 * @param {HTMLElement} cartItem - Cart item element
 */
export function updateBrandingPrices(cartItem) {
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    const brandingItems = cartItem.querySelectorAll('.branding-item');
    let brandingTotal = 0;
    
    brandingItems.forEach(item => {
        // Get branding price
        const priceInput = item.querySelector('.branding-price');
        const pricePerItem = parseFloat(priceInput.value);
        
        // Calculate branding cost for all items
        const secondPass = item.querySelector('.branding-second-pass').checked;
        const colors = parseInt(item.querySelector('.branding-colors')
            .querySelector('li').value);
        // Multiplier based on number of colors
        let colorMultiplier = 1;
        if (!isNaN(colors)) {
            // Increase price by 20% for each additional color
            colorMultiplier = 1 + (colors - 1) * 0.2;
        }
        
        // If second pass is selected, increase price by 30%
        const secondPassMultiplier = secondPass ? 1.3 : 1;
        
        // Final branding price
        const totalPrice = pricePerItem * quantity * colorMultiplier * secondPassMultiplier;
        brandingTotal += totalPrice;
        
        // Update branding price display
        const brandingTotalPriceInput = item.querySelector('.branding-total-price-input');
        if (brandingTotalPriceInput) {
            brandingTotalPriceInput.value = totalPrice.toFixed(2);
        } else {
            // For backward compatibility
            const brandingTotalPrice = item.querySelector('.branding-total-price');
            if (brandingTotalPrice) {
                brandingTotalPrice.textContent = formatPrice(totalPrice.toFixed(0)) + ' руб.';
            }
        }
    });
    
    // Update total branding cost
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    if (brandingSubtotalInput) {
        brandingSubtotalInput.value = brandingTotal.toFixed(2);
    } else {
        // For backward compatibility
        const brandingSubtotal = cartItem.querySelector('.branding-subtotal-price');
        if (brandingSubtotal) {
            brandingSubtotal.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
        }
    }
    
    return brandingTotal;
}

/**
 * Updates the final total price for a cart item including branding
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} itemTotal - Item total without branding
 */
export function updateItemFinalTotal(cartItem, itemTotal) {
    // Get branding total
    let brandingTotal = 0;
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    
    if (brandingSubtotalInput) {
        brandingTotal = parseFloat(brandingSubtotalInput.value);
    } else {
        // For backward compatibility
        const brandingTotalText = cartItem.querySelector('.branding-subtotal-price')?.textContent;
        if (brandingTotalText) {
            brandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Calculate final total
    const finalTotal = itemTotal + brandingTotal;
    
    // Update final total display
    const finalTotalInput = cartItem.querySelector('.cart-item__final-total-price-input');
    if (finalTotalInput) {
        finalTotalInput.value = finalTotal.toFixed(2);
    } else {
        // For backward compatibility
        const finalTotalElement = cartItem.querySelector('.cart-item__final-total-price');
        if (finalTotalElement) {
            finalTotalElement.textContent = formatPrice(finalTotal.toFixed(0)) + ' руб.';
        }
    }
} 