'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";

export function cancelEdit(dataInitial, data) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const dataDisabled = data.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = true;
    });
    if (dataInitial) fillInputsWithData(dataInitial, data);
}