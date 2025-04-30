/**
 * Order form handler module
 * Handles form submission and validation
 */

'use strict';

import { validateOrderForm } from './validation.js';
import { collectOrderData } from './dataCollector.js';

/**
 * Initialize order form submission handler
 */
export function initOrderFormHandler() {
    const form = document.querySelector('.order-form');
    if (!form) return;
    
    // Replace the existing submit event listener with our enhanced version
    form.addEventListener('submit', function(event) {
        // Prevent default form submission to handle it ourselves
        event.preventDefault();
        
        // Validate form
        const isValid = validateOrderForm(form);
        
        if (isValid) {
            // Collect form data
            const orderData = collectOrderData(form);
            
            // Log data to console (for debugging)
            console.log('Order data:', orderData);
            
            // Submit the form
            form.submit();
        }
    });
} 