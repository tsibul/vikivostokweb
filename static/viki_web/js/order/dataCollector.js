/**
 * Order form data collector module
 * Collects data from order form for submission
 */

'use strict';

/**
 * Collect order form data
 * @param {HTMLFormElement} form - The order form element
 * @returns {Object} Collected order data
 */
export function collectOrderData(form) {
    const userData = collectUserData(form);
    const items = collectItemsData();
    const additionalData = collectAdditionalData(form);
    
    return {
        ...userData,
        ...additionalData,
        items
    };
}

/**
 * Collect user data from form
 * @param {HTMLFormElement} form - The order form element
 * @returns {Object} User data
 */
function collectUserData(form) {
    // Get user_extension_id from order-section-title data attribute
    const userExtensionId = document.querySelector('.order-section-title')?.getAttribute('data-id') || '';
    
    // Get customer_id - different approaches for staff and non-staff users
    let customerId = '';
    
    // First try to get from the customer dropdown input (staff users)
    const customerIdInput = document.querySelector('input[name="customer_id"]');
    if (customerIdInput) {
        customerId = customerIdInput.value;
    } else {
        // For non-staff users, get customer_id from the customerData in order-section-title
        // This requires adding a data-customer-id attribute to the order-section-title element in the template
        const sectionTitle = document.querySelector('.order-section-title');
        if (sectionTitle) {
            customerId = sectionTitle.getAttribute('data-customer-id') || '';
        }
    }
    
    // Get company information
    const companyId = form.querySelector('input[name="company_id"]')?.value || '';
    const companyVat = form.querySelector('input[name="company_vat"]')?.value || '';
    
    return {
        user_extension_id: userExtensionId,
        customer_id: customerId,
        company_id: companyId,
        company_vat: companyVat
    };
}

/**
 * Collect additional order data like comment and delivery option
 * @param {HTMLFormElement} form - The order form element
 * @returns {Object} Additional data
 */
function collectAdditionalData(form) {
    // Get customer comment
    const customerComment = form.querySelector('textarea[name="customer_comment"]')?.value || '';
    
    // Get delivery option
    const deliveryOptionId = form.querySelector('input[name="delivery_option_id"]')?.value || '';
    const deliveryPrice = parseFloat(form.querySelector('input[name="delivery_price"]')?.value || '0');
    
    return {
        customer_comment: customerComment,
        delivery_option_id: deliveryOptionId,
        delivery_price: deliveryPrice
    };
}

/**
 * Round a number to 2 decimal places, with 0.5 always rounded up
 * @param {number} value - Value to round
 * @returns {number} - Rounded number
 */
function roundToTwoDecimals(value) {
    // Multiply by 100, round to integer and divide by 100
    // Math.ceil is used for positive numbers where fractional part is exactly 0.5
    // This ensures 2.5 rounds to 3, not 2
    const valueWithTwoDecimals = Math.round(value * 100) / 100;
    
    // Check if we have exactly 0.5 in the hundredths place
    const fractionalPart = Math.abs(valueWithTwoDecimals * 100 - Math.floor(valueWithTwoDecimals * 100));
    if (fractionalPart === 0.5) {
        // If it's exactly 0.5 in the hundredths, round up
        return Math.ceil(value * 100) / 100;
    }
    
    return valueWithTwoDecimals;
}

/**
 * Collect items data from localStorage
 * @returns {Array} Items data with branding information
 */
function collectItemsData() {
    // Get cart data from localStorage
    const cartData = localStorage.getItem('cart');
    if (!cartData) {
        return [];
    }
    
    try {
        const cartItems = JSON.parse(cartData);
        
        // Transform cart items to the format needed for the order
        return cartItems.map(item => {
            // Extract base item data
            const price = roundToTwoDecimals(item.discountPrice || item.price);
            const quantity = item.quantity;
            const total = roundToTwoDecimals(price * quantity);
            
    const itemData = {
                id: item.id,
        price: price,
        quantity: quantity,
        total: total
    };
            
            // Add branding information if available
            if (item.branding && item.branding.length > 0) {
                itemData.branding = item.branding.map(brandingItem => {
                    // Calculate branding price correctly:
                    // base price * colors * 1.3 (if second_pass)
                    const secondPassMultiplier = brandingItem.secondPass ? 1.3 : 1;
                    const calculatedPrice = roundToTwoDecimals(brandingItem.price * brandingItem.colors * secondPassMultiplier);
                    const totalBrandingPrice = roundToTwoDecimals(calculatedPrice * quantity);
                    
                    return {
                        type_id: brandingItem.type_id,
                        location_id: brandingItem.location_id,
                        colors: brandingItem.colors,
                        second_pass: brandingItem.secondPass,
                        price: calculatedPrice,
                        total: totalBrandingPrice
                    };
                });
            } else {
                itemData.branding = [];
            }
    
    return itemData;
        });
    } catch (error) {
        console.error('Error parsing cart data from localStorage:', error);
        return [];
    }
}

// /**
//  * Collect data for a single item
//  * @param {HTMLElement} itemElement - The order item element
//  * @returns {Object} Item data
//  */
// function collectItemData(itemElement) {
//     // This function is kept for backward compatibility
//     // but is no longer used as we get data from localStorage
//
//     // Get item ID from first price element with data-item attribute
//     const firstPriceElement = itemElement.querySelector('.order-item__price[data-item]');
//     const itemId = firstPriceElement ? firstPriceElement.getAttribute('data-item') : '';
//
//     // Get price, quantity and total
//     const priceElement = itemElement.querySelector('.order-item__price[data-price]');
//     const price = priceElement ? parseFloat(priceElement.getAttribute('data-price')) : 0;
//
//     const quantityElement = itemElement.querySelector('.order-item__price[data-quantity]');
//     const quantity = quantityElement ? parseInt(quantityElement.getAttribute('data-quantity')) : 0;
//
//     const totalElement = itemElement.querySelector('.order-item__price[data-total]:not(.order-item__branding-price .order-item__price)');
//     const total = totalElement ? parseFloat(totalElement.getAttribute('data-total')) : 0;
//
//     // Base item data
//     const itemData = {
//         id: itemId,
//         price: price,
//         quantity: quantity,
//         total: total
//     };
//
//     return itemData;
// }