/**
 * @fileoverview Main cabinet module that handles company and bank data management
 * @module cabinet
 */

'use strict';

import {allInputDisabled} from "./cabinet/allInputDisabled.js";
import {editBtnListeners} from "./cabinet/editBtnListeners.js";
import {fullDataInitial} from "./cabinet/fullDataInitial.js";
import {saveCompany} from "./cabinet/saveCompany.js";
import {checkCompany} from "./cabinet/checkCompany.js";
import {cancelDialog} from "./cabinet/cancelDialog.js";
import {modalDnD} from "./common/modalDnD.js";
import {checkBank} from './cabinet/checkBank.js';
import {saveBank} from './cabinet/saveBank.js';

/**
 * Collection of all disabled input elements in the form
 * @type {NodeList}
 */
const allInputs = document.querySelectorAll('input.input-disabled');

/**
 * Personal data section element
 * @type {HTMLElement}
 */
const personalData = document.querySelector('.personal-data');

/**
 * Legal data section element
 * @type {HTMLElement}
 */
const legalData = document.querySelector('.legal-data');

/**
 * Company dialog modal element
 * @type {HTMLElement}
 */
export const companyDialog = document.querySelector('#company-dialog');

/**
 * Company save dialog modal element
 * @type {HTMLElement}
 */
export const companySaveDialog = document.querySelector('#company-dialog-save');

/**
 * Bank dialog modal element
 * @type {HTMLElement}
 */
export const bankDialog = document.querySelector('#bank-dialog');

/**
 * Bank save dialog modal element
 * @type {HTMLElement}
 */
export const bankSaveDialog = document.querySelector('#bank-dialog-save');

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

// Initialize bank dialog handlers
document.querySelector('#new-bank').addEventListener('click', (e) => {
        const companyId = e.target.closest('.company').querySelector(`input[name="id"]`).value;
        bankDialog.querySelector('form').dataset.companyId = companyId;
        bankDialog.showModal();
        modalDnD(bankDialog);
    });

bankDialog.querySelector('form').addEventListener('submit', async (e) => {
    const companyId = e.target.dataset.companyId;
    await checkBank(e, bankDialog, companyId);
});
bankDialog.querySelector('form').addEventListener('reset', (e) => {
    cancelDialog(e, bankDialog);
});
bankSaveDialog.querySelector('form').addEventListener('submit', async (e) => {
    await saveBank(e, bankSaveDialog);
});
bankSaveDialog.querySelector('form').addEventListener('reset', (e) => {
    cancelDialog(e, bankSaveDialog);
});

await editBtnListeners(personalData, personalDataInitial, '#first_name', 'personal');

[...allInputs].forEach(item => {
    item.addEventListener('mousedown', (e) => {
        item.classList.remove('alert-border');
        item.closest('form').querySelector('.alert').textContent = '';
    });
})