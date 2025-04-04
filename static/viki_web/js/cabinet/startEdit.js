/**
 * @fileoverview Module for starting personal data editing
 * @module cabinet/startEdit
 */

'use strict';

/**
 * Enables editing of personal data by showing save controls and enabling inputs
 * @param {HTMLElement} data - Element containing the form with personal data
 */
export function startEdit(data) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const dataDisabled = data.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = false;
    });
    data.querySelector('.alert').textContent = '';
}