/**
 * @fileoverview Module for canceling personal data editing
 * @module cabinet/cancelEdit
 */

'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";
import {hidePriceSelect} from "./priceListHandler.js";

/**
 * Cancels editing of personal data and restores initial values
 * @param {Object} dataInitial - Initial data state
 * @param {HTMLElement} data - Element containing the form with personal data
 * @param {boolean} isStaff - Whether the current user has staff status
 */
export function cancelEdit(dataInitial, data, isStaff) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const dataDisabled = data.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = true;
        input.classList.remove('alert-border');
    });
    
    // Reset form values to initial state
    if (dataInitial) {
        fillInputsWithData(dataInitial, data);
    }
    
    // Hide alert if any
    data.querySelector('.alert').textContent = '';
    
    // Hide price select dropdown for staff users
    hidePriceSelect(isStaff);
}