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
    
    // Initialize form validation
    initFormValidation();
    
    // Calculate totals
    calculateTotals();
});

/**
 * Initialize company dropdown functionality
 */
function initCompanyDropdown() {
    const dropdown = document.querySelector('.order-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.order-dropdown__selected');
    const options = dropdown.querySelector('.order-dropdown__options');
    const optionItems = dropdown.querySelectorAll('.order-dropdown__option');
    
    // Toggle dropdown on click
    selected.addEventListener('click', function() {
        options.classList.toggle('active');
    });
    
    // Handle option selection
    optionItems.forEach(option => {
        option.addEventListener('click', function() {
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
        if (!dropdown.contains(event.target)) {
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
        // Get item total
        const itemTotalElement = item.querySelector('.order-item__total .order-item__value');
        if (itemTotalElement) {
            const itemTotal = parseFloat(itemTotalElement.textContent);
            if (!isNaN(itemTotal)) {
                goodsTotal += itemTotal;
            }
        }
        
        // Get branding total
        const brandingPriceElement = item.querySelector('.order-item__branding-price .order-item__value');
        if (brandingPriceElement) {
            const brandingPrice = parseFloat(brandingPriceElement.textContent);
            if (!isNaN(brandingPrice)) {
                brandingTotal += brandingPrice;
            }
        }
    });
    
    // Update totals in the summary
    const goodsTotalElement = document.querySelector('.goods-total');
    const brandingTotalElement = document.querySelector('.branding-total');
    const orderTotalElement = document.querySelector('.order-total');
    
    if (goodsTotalElement) {
        goodsTotalElement.textContent = goodsTotal.toFixed(2);
    }
    
    if (brandingTotalElement) {
        brandingTotalElement.textContent = brandingTotal.toFixed(2);
    }
    
    if (orderTotalElement) {
        const orderTotal = goodsTotal + brandingTotal;
        orderTotalElement.textContent = orderTotal.toFixed(2);
    }
} 