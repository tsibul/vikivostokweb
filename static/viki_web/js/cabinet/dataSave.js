'use strict';

import {sendFormData} from "../common/sendFormData.js";

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