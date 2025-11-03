/**
 * @fileoverview Module for starting legal data editing
 * @module cabinet/startLegalEdit
 */

'use strict';

/**
 * Enables editing of legal data by showing save controls and enabling inputs
 * @param {HTMLElement} data - Element containing the form with legal data
 */
export function startLegalEdit(data) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const form = data.querySelector('form')
    const dataDisabled = form.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = false;
    });
    data.querySelector('.alert').textContent = '';
}