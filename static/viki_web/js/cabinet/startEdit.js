/**
 * @fileoverview Module for starting personal data editing
 * @module cabinet/startEdit
 */

'use strict';

import {showPriceSelect} from "./priceListHandler.js";

/**
 * Enables editing of personal data by showing save controls and enabling inputs
 * @param {HTMLElement} data - Element containing the form with personal data
 * @param {boolean} isStaff - Whether the current user has staff status
 */
export function startEdit(data, isStaff) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const dataDisabled = data.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = false;
    });
    data.querySelector('.alert').textContent = '';
    
    // Show price select dropdown for staff users
    showPriceSelect(isStaff);
}