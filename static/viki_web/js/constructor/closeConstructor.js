/**
 * @fileoverview Module for closing the product constructor dialog
 * @module constructor/closeConstructor
 */

'use strict'

/**
 * Closes and removes the constructor dialog
 * @param {HTMLElement} modal - Constructor dialog element to close
 */
export function closeConstructor(modal) {
    modal.close();
    modal.remove();
}