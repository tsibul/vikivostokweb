/**
 * Order page functionality
 * Handles company dropdown and form validation
 */

'use strict';

/**
 * Initialize the order page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize company dropdown
    initCompanyDropdown();
    
    // Initialize customer dropdown for staff users
    initCustomerDropdown();
    
    // Initialize form validation
    initFormValidation();
    
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
            
            // Submit form to update customer
            const form = document.querySelector('.order-form');
            if (form) {
                // Добавляем скрытое поле для указания, что это смена клиента
                let customerChangeInput = document.getElementById('customer_change_flag');
                if (!customerChangeInput) {
                    customerChangeInput = document.createElement('input');
                    customerChangeInput.type = 'hidden';
                    customerChangeInput.id = 'customer_change_flag';
                    customerChangeInput.name = 'customer_change';
                    customerChangeInput.value = '1';
                    form.appendChild(customerChangeInput);
                }
                
                form.submit();
            }
            
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
 * Initialize form validation
 */
function initFormValidation() {
    const form = document.querySelector('.order-form');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        const brandingInputs = document.querySelectorAll('.order-item__branding-input');
        let valid = true;
        
        // Validate branding name inputs
        brandingInputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
        
        if (!valid) {
            event.preventDefault();
            alert('Пожалуйста, заполните название нанесения для всех товаров');
        }
    });
    
    // Remove invalid class on input
    const brandingInputs = document.querySelectorAll('.order-item__branding-input');
    brandingInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('invalid');
            }
        });
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
    
    // Update totals in the summary
    const goodsTotalElement = document.querySelector('.goods-total');
    const brandingTotalElement = document.querySelector('.branding-total');
    const orderTotalElement = document.querySelector('.order-total');
    
    if (goodsTotalElement) {
        goodsTotalElement.textContent = formatNumber(goodsTotal.toFixed(2));
    }
    
    if (brandingTotalElement) {
        brandingTotalElement.textContent = formatNumber(brandingTotal.toFixed(2));
    }
    
    if (orderTotalElement) {
        const orderTotal = goodsTotal + brandingTotal;
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