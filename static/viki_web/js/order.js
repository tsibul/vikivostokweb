/**
 * Order page functionality
 * Handles company dropdown and form validation
 */

'use strict';

import { initOrderFormHandler } from './order/formHandler.js';
import { collectOrderData } from './order/dataCollector.js';
import { validateOrderForm } from './order/validation.js';
import { showErrorNotification } from './cart/addToCart/notification.js';

/**
 * Shows a success notification for an order
 * @param {string} orderNo - Order number
 * @param {number} [duration=3000] - Duration in ms to show notification
 */
function showOrderSuccessNotification(orderNo, duration = 3000) {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'success-notification active';

        notification.innerHTML = `
            <i class="fa-solid fa-check success-notification__icon"></i>
            <div class="success-notification__content">
                <h4 class="success-notification__title">Заказ успешно создан</h4>
                <p class="success-notification__message">Номер заказа: ${orderNo}</p>
            </div>
            <button class="success-notification__close">×</button>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Setup auto-close
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Setup close button
        notification.querySelector('.success-notification__close').addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        });
    } catch (error) {
        console.error('Error showing order success notification:', error);
    }
}

/**
 * Initialize the order page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize company dropdown
    initCompanyDropdown();
    
    // Initialize customer dropdown for staff users
    initCustomerDropdown();
    
    // Initialize delivery dropdown
    initDeliveryDropdown();
    
    // Initialize submit button for order submission
    initOrderSubmitButton();
    
    // Calculate totals
    calculateTotals();
});

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Initialize company dropdown functionality
 */
function initCompanyDropdown() {
    const dropdown = document.querySelector('.company-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const optionItems = dropdown.querySelectorAll('.dropdown-option');
    
    // Toggle dropdown on click
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        options.classList.toggle('active');
    });
    
    // Handle option selection
    optionItems.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Update selected text
            const name = this.getAttribute('data-name');
            selected.querySelector('.company-name').textContent = name;
            
            // Update hidden inputs
            selected.querySelector('input[name="company_id"]').value = this.getAttribute('data-id');
            selected.querySelector('input[name="company_vat"]').value = this.getAttribute('data-vat');
            
            // Update company details display
            updateCompanyDetails(this);
            
            // Close dropdown
            options.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (options.classList.contains('active') && !dropdown.contains(event.target)) {
            options.classList.remove('active');
        }
    });
}

/**
 * Update company details display
 * @param {HTMLElement} option - Selected company option element
 */
function updateCompanyDetails(option) {
    const innKpp = document.querySelector('.company-inn-kpp');
    const address = document.querySelector('.company-address');
    
    if (innKpp) {
        const inn = option.getAttribute('data-inn');
        const kpp = option.getAttribute('data-kpp');
        innKpp.textContent = inn + (kpp ? '/' + kpp : '');
    }
    
    if (address) {
        address.textContent = option.getAttribute('data-address');
    }
}

/**
 * Initialize customer dropdown functionality for staff users
 */
function initCustomerDropdown() {
    const dropdown = document.querySelector('.customer-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const optionItems = dropdown.querySelectorAll('.dropdown-option');
    
    // Toggle dropdown on click
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        options.classList.toggle('active');
    });
    
    // Handle option selection
    optionItems.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Проверяем, не выбран ли уже этот клиент
            const currentId = selected.querySelector('input[name="customer_id"]').value;
            const newId = this.getAttribute('data-id');
            
            if (currentId === newId) {
                options.classList.remove('active');
                return; // Если выбран тот же клиент, просто закрываем список
            }
            
            // Update selected text
            const name = this.getAttribute('data-name');
            selected.querySelector('.customer-name').textContent = name;
            
            // Update hidden input
            selected.querySelector('input[name="customer_id"]').value = newId;
            
            // Update customer_id data attribute on section title for data collection
            const sectionTitle = document.querySelector('.order-section-title');
            if (sectionTitle) {
                sectionTitle.setAttribute('data-customer-id', newId);
            }
            
            // Update customer on server to refresh company list
            updateCustomerOnServer(newId);
            
            // Close dropdown
            options.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (options.classList.contains('active') && !dropdown.contains(event.target)) {
            options.classList.remove('active');
        }
    });
}

/**
 * Initialize delivery options dropdown
 */
function initDeliveryDropdown() {
    const dropdown = document.querySelector('.delivery-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.delivery-dropdown__selected');
    const options = dropdown.querySelector('.delivery-dropdown__options');
    const optionItems = dropdown.querySelectorAll('.delivery-dropdown__option');
    
    // Initialize delivery cost display
    updateDeliveryCostDisplay();
    
    // Toggle dropdown on click
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        options.classList.toggle('active');
    });
    
    // Handle option selection
    optionItems.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Update selected text
            const name = this.getAttribute('data-name');
            selected.querySelector('.delivery-name').textContent = name;
            
            // Get delivery price
            const price = parseFloat(this.getAttribute('data-price')) || 0;
            
            // Update hidden inputs
            selected.querySelector('input[name="delivery_option_id"]').value = this.getAttribute('data-id');
            selected.querySelector('input[name="delivery_price"]').value = price;
            
            // Update delivery cost display and recalculate totals
            updateDeliveryCostDisplay();
            calculateTotals();
            
            // Close dropdown
            options.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (options.classList.contains('active') && !dropdown.contains(event.target)) {
            options.classList.remove('active');
        }
    });
}

/**
 * Update delivery cost display in order summary
 */
function updateDeliveryCostDisplay() {
    const deliveryPriceInput = document.querySelector('input[name="delivery_price"]');
    const deliveryCostRow = document.querySelector('.delivery-cost-row');
    const deliveryTotalElement = document.querySelector('.delivery-total');
    
    if (deliveryPriceInput && deliveryCostRow && deliveryTotalElement) {
        const deliveryPrice = parseFloat(deliveryPriceInput.value) || 0;
        
        if (deliveryPrice > 0) {
            // Show delivery cost row and update value
            deliveryCostRow.style.display = '';
            deliveryTotalElement.textContent = formatNumber(deliveryPrice.toFixed(2));
        } else {
            // Hide delivery cost row if price is 0
            deliveryCostRow.style.display = 'none';
        }
    }
}

/**
 * Update customer on server without full page reload
 * @param {string} customerId - New customer ID
 */
function updateCustomerOnServer(customerId) {
    // Get CSRF token
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    
    // Create FormData
    const formData = new FormData();
    formData.append('customer_id', customerId);
    formData.append('customer_change', '1');
    
    // Use fetch API to update customer
    fetch(window.location.href, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(html => {
        // Process the response to update the company dropdown
        updateCompanyDropdown(html);
    })
    .catch(error => {
        console.error('Error updating customer:', error);
    });
}

/**
 * Update company dropdown from HTML response
 * @param {string} html - HTML response from server
 */
function updateCompanyDropdown(html) {
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract company dropdown HTML from response
    const newCompanySelection = tempDiv.querySelector('.order-customer__company-selection');
    const newCompanyDetails = tempDiv.querySelector('.order-customer__company-details');
    
    if (newCompanySelection) {
        // Update company dropdown HTML
        const currentCompanySelection = document.querySelector('.order-customer__company-selection');
        if (currentCompanySelection) {
            currentCompanySelection.innerHTML = newCompanySelection.innerHTML;
        }
    }
    
    if (newCompanyDetails) {
        // Update company details HTML
        const currentCompanyDetails = document.querySelector('.order-customer__company-details');
        if (currentCompanyDetails) {
            currentCompanyDetails.innerHTML = newCompanyDetails.innerHTML;
        }
    }
    
    // Re-initialize company dropdown functionality
    initCompanyDropdown();
}

/**
 * Initialize submit button for order submission
 */
function initOrderSubmitButton() {
    const submitButton = document.querySelector('.order-form .btn__save');
    const form = document.querySelector('.order-form');
    
    if (!submitButton || !form) return;
    
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateOrderForm(form)) {
            return; // Form validation failed
        }
        
        // Collect form data
        const orderData = collectOrderData(form);
        
        // Submit order data to server
        submitOrderToServer(orderData, form);
    });
}

/**
 * Submit order data to server
 * @param {Object} orderData - Collected order data
 * @param {HTMLFormElement} form - The order form
 */
function submitOrderToServer(orderData, form) {
    // Get CSRF token
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    
    // Convert order data to FormData
    const formData = new FormData();
    
    // Add user data
    formData.append('user_extension_id', orderData.user_extension_id);
    formData.append('customer_id', orderData.customer_id);
    formData.append('company_id', orderData.company_id);
    formData.append('company_vat', orderData.company_vat);
    
    // Add additional data
    formData.append('customer_comment', orderData.customer_comment);
    formData.append('delivery_option_id', orderData.delivery_option_id);
    
    // Add items data as JSON
    formData.append('items', JSON.stringify(orderData.items));
    
    // Use fetch API to submit order
    fetch('/create_order/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'ok') {
            // Show success notification with order number
            showOrderSuccessNotification(data.order_no);
            
            // Redirect with delay
            setTimeout(() => {
                window.location.href = data.redirect_url || '/cart';
            }, 3000); // 3 second delay
        } else {
            // Display error message
            showErrorNotification(data.message || 'Ошибка при оформлении заказа');
        }
    })
    .catch(error => {
        console.error('Error submitting order:', error);
        showErrorNotification('Произошла ошибка при отправке заказа');
    });
}

/**
 * Calculate order totals
 */
function calculateTotals() {
    const items = document.querySelectorAll('.order-item');
    let goodsTotal = 0;
    let brandingTotal = 0;
    
    items.forEach(item => {
        // Get item total (product total)
        const itemTotalElements = item.querySelectorAll('.order-item__pricing .order-item__price[data-total]');
        
        itemTotalElements.forEach(element => {
            const totalValue = element.querySelector('span:last-child').textContent;
            const totalAmount = parseFloat(totalValue.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(totalAmount)) {
                // Check if this is a branding element or product element
                if (element.closest('.order-item__branding-price')) {
                    brandingTotal += totalAmount;
                } else {
                    goodsTotal += totalAmount;
                }
            }
        });
    });
    
    // Get delivery cost
    const deliveryPriceInput = document.querySelector('input[name="delivery_price"]');
    const deliveryPrice = deliveryPriceInput ? parseFloat(deliveryPriceInput.value) || 0 : 0;
    
    // Update totals in the summary
    const goodsTotalElement = document.querySelector('.goods-total');
    const brandingTotalElement = document.querySelector('.branding-total');
    const deliveryTotalElement = document.querySelector('.delivery-total');
    const orderTotalElement = document.querySelector('.order-total');
    
    if (goodsTotalElement) {
        goodsTotalElement.textContent = formatNumber(goodsTotal.toFixed(2));
    }
    
    if (brandingTotalElement) {
        brandingTotalElement.textContent = formatNumber(brandingTotal.toFixed(2));
    }
    
    if (deliveryTotalElement && deliveryPrice > 0) {
        deliveryTotalElement.textContent = formatNumber(deliveryPrice.toFixed(2));
    }
    
    if (orderTotalElement) {
        const orderTotal = goodsTotal + brandingTotal + deliveryPrice;
        orderTotalElement.textContent = formatNumber(orderTotal.toFixed(2));
    }
    
    // Also format all price values in the order items
    formatAllPrices();
}

/**
 * Format all price values with thousands separators
 */
function formatAllPrices() {
    // Format product prices
    const priceElements = document.querySelectorAll('.order-item__price span:last-child');
    
    priceElements.forEach(element => {
        if (element.textContent.includes('руб.')) {
            const value = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
            if (!isNaN(value)) {
                element.textContent = formatNumber(value.toFixed(2)) + ' руб.';
            }
        }
    });
} 