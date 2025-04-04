/**
 * @fileoverview Module for saving company data
 * @module cabinet/saveCompany
 */

'use strict';

import {sendFormData} from "../common/sendFormData.js";

/**
 * Saves company data by sending it to the server
 * @param {Event} e - Form submit event
 * @param {HTMLElement} dialogForm - Dialog form element
 * @returns {Promise<void>}
 */
export async function saveCompany(e, dialogForm){
    e.preventDefault();
    const form = dialogForm.querySelector('form');
    const response = await sendFormData('/save_new_company/', form);
    if (response.status === 'ok') {
        dialogForm.close();
        window.location.reload();
    } else {
        dialogForm.querySelector('.alert').textContent = response.message;
    }
}