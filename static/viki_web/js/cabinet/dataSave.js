/**
 * @fileoverview Module for saving personal data changes
 * @module cabinet/dataSave
 */

'use strict';

import {sendFormData} from "../common/sendFormData.js";

/**
 * Saves changes to personal data and handles the response
 * @param {HTMLFormElement} form - Form element containing the data to save
 * @param {string} dataType - Type of data being saved
 * @returns {Promise<void>}
 */
export async function dataSave(form, dataType) {
    const url = '/cabinet/save/' + dataType;
    const response = await sendFormData(url, form);
    if (response.status === 'ok') {
        window.location.reload();
    } else {
        form.querySelector('.alert').textContent = response.message;
        if (response.field) {
            form.querySelector(`#${response.field}`).classList.add('alert-border');
        }
    }
}