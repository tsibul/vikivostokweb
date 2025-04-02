'use strict';

import {sendFormData} from "../common/sendFormData.js";
import {bankSaveDialog} from "../cabinet.js";
import {modalDnD} from "../common/modalDnD.js";

/**
 * Validates bank account details and opens a dialog for saving if validation is successful
 * @param {Event} e - The form submission event
 * @param {HTMLDialogElement} dialog - The dialog element containing the form
 * @param {string} companyId - The ID of the company to associate the bank account with
 * @returns {Promise<void>}
 */
export async function checkBank(e, dialog, companyId) {
    e.preventDefault();
    const dialogForm = dialog.querySelector('form');
    const response = await sendFormData('/check_bank/', dialogForm);
    if (response.status === 'ok') {
        const dialogInputs = bankSaveDialog.querySelectorAll('input');
        [...dialogInputs].forEach(input => {
            if (input.type === 'hidden') {
                input.value = companyId;
            } else {
                input.value = response.bank[input.name];
            }
        });
        dialog.close();
        bankSaveDialog.showModal();
        modalDnD(bankSaveDialog);
    } else {
        dialog.querySelector('.alert').textContent = response.message;
    }
} 