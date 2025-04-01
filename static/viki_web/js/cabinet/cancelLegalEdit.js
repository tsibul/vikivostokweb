'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";

export function cancelLegalEdit(dataInitial, data) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const form = data.querySelector('form');
    const dataDisabled = form.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = true;
        input.classList.remove('alert-border')
    });
    if (dataInitial) fillInputsWithData(dataInitial, form);
    data.querySelector('.alert').textContent = '';
}