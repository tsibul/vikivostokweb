/**
 * Order form validation module
 * Validates branding inputs and company selection
 */

'use strict';

import { showErrorNotification } from '../cart/addToCart/notification.js';

/**
 * Validate order form
 * @param {HTMLFormElement} form - The order form element
 * @returns {boolean} Whether the form is valid
 */
export function validateOrderForm(form) {
    const brandingInputs = form.querySelectorAll('.order-item__branding-input');
    const companyId = form.querySelector('input[name="company_id"]');
    let isValid = true;
    
    // Validate branding name inputs (only if they exist)
    if (brandingInputs.length > 0) {
        brandingInputs.forEach(input => {
            if (!validateBrandingInput(input)) {
                isValid = false;
                highlightInvalidField(input);
            }
        });
        
        if (!isValid) {
            showErrorNotification('Пожалуйста, заполните названия нанесений для всех товаров');
        }
    }
    
    // Validate company selection
    if (!companyId || !companyId.value) {
        isValid = false;
        
        // Show company warning dialog without notification
        if (!document.getElementById('company-warning-dialog')) {
            showCompanyWarningDialog();
        }
    }
    
    return isValid;
}

/**
 * Validate branding input
 * @param {HTMLInputElement} input - The branding input element
 * @returns {boolean} Whether the input is valid
 */
function validateBrandingInput(input) {
    const value = input.value.trim();
    // Check if input is not empty and contains valid characters (letters, numbers, spaces)
    const regex = /^[а-яА-ЯёЁa-zA-Z0-9\s]+$/;
    return value.length > 0 && regex.test(value);
}

/**
 * Highlight invalid field with red border
 * @param {HTMLInputElement} input - The invalid input element
 */
function highlightInvalidField(input) {
    input.classList.add('invalid');
    
    // Remove invalid class on focus
    input.addEventListener('focus', function onFocus() {
        this.classList.remove('invalid');
        // Remove event listener after first focus to avoid multiple listeners
        this.removeEventListener('focus', onFocus);
    }, { once: true });
}

/**
 * Show company warning dialog
 */
function showCompanyWarningDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'company-warning-dialog';
    dialog.className = 'company-warning-dialog';
    
    dialog.innerHTML = `
        <div class="company-warning-dialog__content">
            <h3 class="company-warning-dialog__title">Компания не выбрана</h3>
            <p class="company-warning-dialog__message">Для оформления заказа необходимо выбрать компанию.</p>
            <div class="company-warning-dialog__actions">
                <button class="btn btn__cancel company-warning-dialog__close">Закрыть</button>
                <a href="/cabinet/" class="btn btn__save">Добавить компанию</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Close dialog when close button is clicked
    dialog.querySelector('.company-warning-dialog__close').addEventListener('click', () => {
        dialog.remove();
    });
    
    // Close dialog when clicking outside
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.remove();
        }
    });
} 