/**
 * @fileoverview Module for saving legal data changes
 * @module cabinet/dataLegalSave
 */

'use strict';

import {sendFormData} from "../common/sendFormData.js";

/**
 * Saves changes to legal data and handles the response
 * @param {HTMLElement} block - Element containing the form with legal data
 * @param {string} dataType - Type of data being saved ('company' or 'bank')
 * @returns {Promise<void>}
 */
export async function dataLegalSave(block, dataType) {
    const form = block.querySelector('form');
    const url = '/cabinet/save/' + dataType;
    const response = await sendFormData(url, form);
    if (response.status === 'ok') {
        window.location.reload();
    } else {
        block.querySelector('.alert').textContent = response.message;
        if (response.field) {
            form.querySelector(`input[data-name="${response.field}"`).classList.add('alert-border');
        }
    }
}