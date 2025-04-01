'use strict';

import {allInputDisabled} from "./cabinet/allInputDisabled.js";
import {editBtnListeners} from "./cabinet/editBtnListeners.js";
import {fullDataInitial} from "./cabinet/fullDataInitial.js";

const allInputs = document.querySelectorAll('input.input-disabled');
const personalData = document.querySelector('.personal-data');
const legalData = document.querySelector('.legal-data');

document.querySelector('li.log-logout').style.display='none'

const dataInitial = await fullDataInitial(personalData, legalData);
const personalDataInitial = dataInitial['personalData']

allInputDisabled();

await editBtnListeners(personalData, personalDataInitial, '#first_name', 'personal');

[...allInputs].forEach(item => {
    item.addEventListener('mousedown', (e) => {
        item.classList.remove('alert-border');
        item.closest('form').querySelector('.alert').textContent = '';
    });
})