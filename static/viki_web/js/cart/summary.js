/**
 * Module for cart summary calculations
 */

import { formatPrice } from './utils.js';

/**
 * Updates cart summary totals
 */
export function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    let brandingTotal = 0;
    
    cartItems.forEach(item => {
        // Item cost
        let itemTotal = 0;
        const itemTotalInput = item.querySelector('.cart-item__total-price-input');
        
        if (itemTotalInput) {
            itemTotal = parseFloat(itemTotalInput.value);
        } else {
            // For backward compatibility
            const itemTotalText = item.querySelector('.cart-item__total-price')?.textContent;
            if (itemTotalText) {
                itemTotal = parseFloat(itemTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
            }
        }
        subtotal += itemTotal;
        
        // Branding cost
        let itemBrandingTotal = 0;
        const brandingSubtotalInput = item.querySelector('.branding-subtotal-price-input');
        
        if (brandingSubtotalInput) {
            itemBrandingTotal = parseFloat(brandingSubtotalInput.value);
        } else {
            // For backward compatibility
            const brandingTotalText = item.querySelector('.branding-subtotal-price')?.textContent;
            if (brandingTotalText) {
                itemBrandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
            }
        }
        brandingTotal += itemBrandingTotal;
    });
    
    // Total cost
    const total = subtotal + brandingTotal;
    
    // Update summary display
    const itemsCountInput = document.querySelector('.cart-summary__items-input');
    const subtotalInput = document.querySelector('.cart-summary__subtotal-input');
    const brandingTotalInput = document.querySelector('.cart-summary__branding-total-input');
    const totalInput = document.querySelector('.cart-summary__total-input');
    
    if (itemsCountInput && subtotalInput && brandingTotalInput && totalInput) {
        itemsCountInput.value = cartItems.length;
        subtotalInput.value = subtotal.toFixed(2);
        brandingTotalInput.value = brandingTotal.toFixed(2);
        totalInput.value = total.toFixed(2);
    } else {
        // For backward compatibility
        const itemsCountElement = document.querySelector('.cart-summary__items span');
        const subtotalElement = document.querySelector('.cart-summary__subtotal span');
        const brandingTotalElement = document.querySelector('.cart-summary__branding-total span');
        const totalElement = document.querySelector('.cart-summary__total span');
        
        if (itemsCountElement && subtotalElement && brandingTotalElement && totalElement) {
            itemsCountElement.textContent = cartItems.length;
            subtotalElement.textContent = formatPrice(subtotal.toFixed(0)) + ' руб.';
            brandingTotalElement.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
            totalElement.textContent = formatPrice(total.toFixed(0)) + ' руб.';
        }
    }
} 