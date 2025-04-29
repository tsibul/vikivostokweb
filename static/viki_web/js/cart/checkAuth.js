/**
 * Authentication check module
 * Checks if user is authenticated before checkout
 */

'use strict';

import {modalDnD} from '../common/modalDnD.js';
import {getCSRFToken} from '../common/getCSRFToken.js';

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
function isAuthenticated() {
    // Check if user is authenticated by looking at the DOM
    const cabinetMenu = document.querySelector('nav.menu__cabinet');
    if (!cabinetMenu) return false;

    // If menu contains "Выйти" link, user is authenticated
    return !!cabinetMenu.querySelector('.log-logout');
}

/**
 * Show authentication dialog
 */
function showAuthDialog() {
    // Create a checkout auth dialog
    const checkoutAuthDialog = document.querySelector('dialog.log-checkout-auth');

    if (checkoutAuthDialog) {
        // Show existing dialog
        checkoutAuthDialog.showModal();
        modalDnD(checkoutAuthDialog);
    } else {
        console.error('Authentication dialog not found');
    }
}

/**
 * Check authentication before proceeding with checkout
 * @returns {boolean} True if authenticated, false otherwise
 */
export function checkAuthBeforeCheckout() {
    if (isAuthenticated()) {
        return true;
    } else {
        showAuthDialog();
        return false;
    }
}

/**
 * Initialize authentication check event listeners
 */
export function initAuthCheck() {
    // Find checkout button
    const checkoutButton = document.querySelector('.cart-summary__checkout');

    if (!checkoutButton) return;

    // Add event listener to checkout button
    checkoutButton.addEventListener('click', function (event) {
        if (!checkAuthBeforeCheckout()) {
            // Prevent default action if not authenticated
            event.preventDefault();
        } else {
            // User is authenticated, proceed with checkout
            // Create a form to submit cart data
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/order/';
            form.style.display = 'none';
            
            // Add cart data from localStorage
            const cartData = localStorage.getItem('cart') || '[]';
            const cartInput = document.createElement('input');
            cartInput.type = 'hidden';
            cartInput.name = 'cart_data';
            cartInput.value = cartData;
            form.appendChild(cartInput);
            
            // Add CSRF token
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = getCSRFToken();
            form.appendChild(csrfInput);
            
            // Add form to document and submit
            document.body.appendChild(form);
            form.submit();
        }
    });

    // Initialize dialog buttons
    initAuthDialogButtons();
}

/**
 * Initialize authentication dialog buttons
 */
function initAuthDialogButtons() {
    const checkoutAuthDialog = document.querySelector('dialog.log-checkout-auth');

    if (!checkoutAuthDialog) return;

    // Close button
    const closeButton = checkoutAuthDialog.querySelector('.btn__cancel');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            checkoutAuthDialog.close();
        });
    }

    // Close on X button
    const closeX = checkoutAuthDialog.querySelector('.login__title div:last-child');
    if (closeX) {
        closeX.addEventListener('click', function () {
            checkoutAuthDialog.close();
        });
    }

    // Login button
    const loginButton = checkoutAuthDialog.querySelector('.checkout-login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            checkoutAuthDialog.close();

            // Open login dialog
            const loginDialog = document.querySelector('dialog.log-login');
            if (loginDialog) {
                loginDialog.showModal();
                modalDnD(loginDialog);
            }
        });
    }

    // Register button
    const registerButton = checkoutAuthDialog.querySelector('.checkout-register-btn');
    if (registerButton) {
        registerButton.addEventListener('click', function () {
            checkoutAuthDialog.close();

            // Open register dialog
            const registerDialog = document.querySelector('dialog.log-register');
            if (registerDialog) {
                registerDialog.showModal();
                registerDialog.querySelector('.btn__save').textContent = 'Зарегистрироваться';
                registerDialog.querySelector('.login__title').firstElementChild.textContent = 'Регистрация';
                registerDialog.querySelector('input.user-type').value = 'new';
                modalDnD(registerDialog);
            }
        });
    }
} 