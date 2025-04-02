'use strict';

import {sendFormData} from "../common/sendFormData.js";

/**
 * Saves bank account details to the server and reloads the page on success
 * @param {Event} e - The form submission event
 * @param {HTMLDialogElement} dialogForm - The dialog element containing the form
 * @returns {Promise<void>}
 */
export async function saveBank(e, dialogForm) {
    e.preventDefault();
    const form = dialogForm.querySelector('form');
    const response = await sendFormData('/save_bank_account/', form);
    if (response.status === 'ok') {
        dialogForm.close();
        window.location.reload();
    } else {
        dialogForm.querySelector('.alert').textContent = response.message;
    }
} 