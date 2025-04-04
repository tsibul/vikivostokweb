/**
 * @fileoverview Module for handling edit cancellation
 * @module cabinet/cancelEdit
 */

'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";

/**
 * Cancels the edit operation and restores initial data
 * @param {Object} dataInitial - Initial data state
 * @param {HTMLElement} data - Container element with form data
 */
export function cancelEdit(dataInitial, data) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const dataDisabled = data.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = true;
        input.classList.remove('alert-border')

    });
    if (dataInitial) fillInputsWithData(dataInitial, data);
    data.querySelector('.alert').textContent = '';
}