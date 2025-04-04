/**
 * @fileoverview Module for clearing dialog form inputs
 * @module authentication/dialogClear
 */

'use strict'

/**
 * Clears all input fields in a dialog form
 * @param {HTMLElement} dialog - Dialog element containing form inputs
 */
export function dialogClear(dialog) {
    dialog.querySelectorAll('input').forEach(input => {
        input.value = null;
    });
}