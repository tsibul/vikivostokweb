'use strict';

import {sendFormData} from "../common/sendFormData.js";

export async function saveCompany(e, dialogForm){
    e.preventDefault();
    const form = dialogForm.querySelector('form');
    const response = await sendFormData('/save_new_company/', form);
    if (response.status === 'ok') {
        dialogForm.close();
        window.location.reload();
    } else {
        dialogForm.querySelector('.alert').textContent = response.message;
    }
}