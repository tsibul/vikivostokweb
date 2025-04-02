'use strict';

import {allInputDisabled} from "./cabinet/allInputDisabled.js";
import {editBtnListeners} from "./cabinet/editBtnListeners.js";
import {fullDataInitial} from "./cabinet/fullDataInitial.js";
import {saveCompany} from "./cabinet/saveCompany.js";
import {checkCompany} from "./cabinet/checkCompany.js";
import {cancelDialog} from "./cabinet/cancelDialog.js";
import {modalDnD} from "./common/modalDnD.js";

const allInputs = document.querySelectorAll('input.input-disabled');
const personalData = document.querySelector('.personal-data');
const legalData = document.querySelector('.legal-data');
export const companyDialog = document.querySelector('#company-dialog');
export const companySaveDialog = document.querySelector('#company-dialog-save');

document.querySelector('li.log-logout').style.display='none'

const dataInitial = await fullDataInitial(personalData, legalData);
const personalDataInitial = dataInitial['personalData']

allInputDisabled();

// companySaveDialog.showModal();
// modalDnD(companySaveDialog);

document.querySelector('#new-company').addEventListener('click', (e) => {
    companyDialog.showModal()
    modalDnD(companyDialog);
});
companyDialog.querySelector('form').addEventListener('submit', async (e) => {
    await checkCompany(e, companyDialog);
});
companyDialog.querySelector('form').addEventListener('reset', (e) => {
    cancelDialog(e, companyDialog);
});
companySaveDialog.querySelector('form').addEventListener('submit', async (e) => {
    await saveCompany(e, companySaveDialog);
});
companySaveDialog.querySelector('form').addEventListener('reset', async (e) => {
    cancelDialog(e, companySaveDialog);
});


await editBtnListeners(personalData, personalDataInitial, '#first_name', 'personal');

[...allInputs].forEach(item => {
    item.addEventListener('mousedown', (e) => {
        item.classList.remove('alert-border');
        item.closest('form').querySelector('.alert').textContent = '';
    });
})