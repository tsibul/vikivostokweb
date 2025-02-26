'use strict'

/**
 *
 * @param e
 */
export function fieldNotFileChange(e) {
    const form = e.target.closest('form');
    const fileField = form.querySelector('input[type="file"]');
    fileField.value = '';
    fileField.dispatchEvent(new Event('change', {bubbles: true}));
}