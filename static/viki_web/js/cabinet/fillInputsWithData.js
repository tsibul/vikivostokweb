/**
 * @fileoverview Module for populating form inputs with data
 * @module cabinet/fillInputsWithData
 */

'use strict';

/**
 * Fills form inputs with provided data
 * @param {Object} data - Data object containing values for inputs
 * @param {HTMLElement} form - Form element containing inputs to be filled
 */
export function fillInputsWithData(data, form) {
    [...form.querySelectorAll('input')].forEach(input => {
        input.value = data[input.dataset.name];
    });
}