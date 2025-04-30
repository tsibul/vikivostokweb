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
    const items = collectItemsData(form);
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
 * Collect items data from form
 * @param {HTMLFormElement} form - The order form element
 * @returns {Array} Items data
 */
function collectItemsData(form) {
    const orderItems = form.querySelectorAll('.order-item');
    const items = [];
    
    orderItems.forEach(item => {
        const itemData = collectItemData(item);
        items.push(itemData);
    });
    
    return items;
}

/**
 * Collect data for a single item
 * @param {HTMLElement} itemElement - The order item element
 * @returns {Object} Item data
 */
function collectItemData(itemElement) {
    // Get item ID from first price element with data-item attribute
    const firstPriceElement = itemElement.querySelector('.order-item__price[data-item]');
    const itemId = firstPriceElement ? firstPriceElement.getAttribute('data-item') : '';
    
    // Get price, quantity and total
    const priceElement = itemElement.querySelector('.order-item__price[data-price]');
    const price = priceElement ? parseFloat(priceElement.getAttribute('data-price')) : 0;
    
    const quantityElement = itemElement.querySelector('.order-item__price[data-quantity]');
    const quantity = quantityElement ? parseInt(quantityElement.getAttribute('data-quantity')) : 0;
    
    const totalElement = itemElement.querySelector('.order-item__price[data-total]:not(.order-item__branding-price .order-item__price)');
    const total = totalElement ? parseFloat(totalElement.getAttribute('data-total')) : 0;
    
    // Base item data
    const itemData = {
        id: itemId,
        price: price,
        quantity: quantity,
        total: total
    };
    
    return itemData;
} 