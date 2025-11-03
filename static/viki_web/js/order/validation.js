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
    const companyId = form.querySelector('input[name="company_id"]');
    let isValid = true;
    
    // Validate company selection
    if (!companyId || !companyId.value) {
        isValid = false;
        
        // Show company warning dialog without notification
        if (!document.getElementById('company-warning-dialog')) {
            showCompanyWarningDialog();
        }
    }
    
    // Validate customer comment if it exists
    const customerComment = form.querySelector('textarea[name="customer_comment"]');
    if (customerComment && !validateCustomerComment(customerComment.value)) {
        isValid = false;
        highlightInvalidField(customerComment);
        showErrorNotification('Недопустимые символы в комментарии');
    }
    
    return isValid;
}

/**
 * Validate customer comment text
 * @param {string} comment - The comment text to validate
 * @returns {boolean} Whether the comment is valid
 */
export function validateCustomerComment(comment) {
    if (!comment || comment.trim() === '') {
        return true; // Empty comment is valid
    }
    
    // Allow letters, numbers, spaces, punctuation, and @
    const regex = /^[а-яА-ЯёЁa-zA-Z0-9\s.,!?;:()"'\-_@]+$/;
    return regex.test(comment);
}

/**
 * Highlight invalid field with red border
 * @param {HTMLElement} element - The invalid input element
 */
function highlightInvalidField(element) {
    element.classList.add('invalid');
    
    // Remove invalid class on focus
    element.addEventListener('focus', function onFocus() {
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