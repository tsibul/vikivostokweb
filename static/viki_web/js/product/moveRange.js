/**
 * @fileoverview Module for handling price range slider movement
 * @module product/moveRange
 */

'use strict'

/**
 * Updates the displayed value of the price range slider
 * @param {Event} e - Input event from the range slider
 */
export function moveRange(e){
    const value = e.target.value;
    const showField = e.target.nextElementSibling;
    showField.textContent = 'до ' + value;
}