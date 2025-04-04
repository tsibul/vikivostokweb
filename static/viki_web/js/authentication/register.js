/**
 * @fileoverview Module for handling user registration functionality
 * @module authentication/register
 */

'use strict'

import {sendFormData} from "../common/sendFormData.js";
import {modalDnD} from "../common/modalDnD.js";
import {dialogClear} from "./dialogClear.js";

/**
 * Registers a new user and sends password to their email
 * @param {Event} e - Form submit event
 * @returns {Promise<void>}
 */
export async function register(e) {
    e.preventDefault();
    const form = e.target;
    const data = await sendFormData('/send-password/', form);
    if (data.status === "ok") {
        const currentDialog = form.closest('dialog')
        const logTempDialog = document.querySelector('dialog.log-temporary');
        logTempDialog.querySelector('#temp-mail').value =
            form.querySelector('#register-mail').value;
        logTempDialog.querySelector('#temp-password').value = null;
        logTempDialog.querySelector('.user-type').value =
            form.querySelector('.user-type').value;
        logTempDialog.querySelector('.alert').textContent = '';
        dialogClear(currentDialog);
        currentDialog.close()
        logTempDialog.showModal();
        logTempDialog.querySelector('#temp-mail').focus();
        modalDnD(logTempDialog);
    } else {
        const alert = form.querySelector('.alert');
        alert.textContent = data.message;
    }

}