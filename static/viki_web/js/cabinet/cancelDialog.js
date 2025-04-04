/**
 * @fileoverview Module for handling dialog cancellation
 * @module cabinet/cancelDialog
 */

'use strict';

/**
 * Closes the dialog and clears any alert messages
 * @param {Event} e - Event object
 * @param {HTMLElement} dialogForm - Form element within the dialog
 */
export function cancelDialog(e, dialogForm) {
    const dialog = dialogForm.closest('dialog');
    const alert = dialog.querySelector('.alert');
    if (alert) {
        alert.textContent = null;
    }
    dialog.close()
}