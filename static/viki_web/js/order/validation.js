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
    
    return isValid;
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