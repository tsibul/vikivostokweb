/**
 * @fileoverview Module for disabling all form inputs
 * @module cabinet/allInputDisabled
 */

'use strict';

/**
 * Disables all inputs with class 'input-disabled'
 */
export function allInputDisabled() {
    const inputDisabled = document.querySelectorAll('.input-disabled');
    [...inputDisabled].forEach(input => {
        input.disabled = true;
    });
}