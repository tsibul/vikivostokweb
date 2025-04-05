/**
 * @fileoverview Module for handling deleted status changes in catalogue
 * @module catalogueElement/deletedChange
 */

'use strict'

/**
 * Handles change in deleted status of catalogue item
 * @param {Event} e - Checkbox change event
 */
export function deletedChange(e) {
    const form = e.target.closest('form');
    if (form.querySelector('textarea').value) {
        const btnSave = form.querySelector('.btn__save');
        btnSave.disabled = false;
        btnSave.classList.remove('btn__disabled');
        const btnCancel = form.querySelector('.btn__cancel');
        btnCancel.disabled = false;
        btnCancel.classList.remove('btn__disabled');
    }
}