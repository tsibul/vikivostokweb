/**
 * @fileoverview Module for handling non-file field changes in catalogue
 * @module catalogueElement/fieldNotFileChange
 */

'use strict'

/**
 * Handles changes to non-file fields by clearing and triggering file field change
 * @param {Event} e - Event object from the field change
 */
export function fieldNotFileChange(e) {
    const form = e.target.closest('form');
    const fileField = form.querySelector('input[type="file"]');
    fileField.value = '';
    fileField.dispatchEvent(new Event('change', {bubbles: true}));
}