'use strict';

import {sendFormData} from "../common/sendFormData.js";

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