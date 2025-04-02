'use strict';

import {sendFormData} from "../common/sendFormData.js";
import {companySaveDialog} from "../cabinet.js";
import {modalDnD} from "../common/modalDnD.js";

export async function checkCompany(e, dialog){
    e.preventDefault();
    const dialogForm = dialog.querySelector('form');
    const response = await sendFormData('/check_company/', dialogForm);
    if (response.status === 'ok') {
        const dialogInputs = companySaveDialog.querySelectorAll('input');
        [...dialogInputs].forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = response.company[input.name];
            } else if (input.type === 'hidden') {
                input.value = response.company[input.name];
            } else {
                input.value = response.company[input.name];
            }
        });
        dialog.close();
        companySaveDialog.showModal()
        modalDnD(companySaveDialog);
    } else {
        dialog.querySelector('.alert').textContent = response.message;
    }
}