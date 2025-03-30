'use strict';

import {fetchJsonData} from "../../viki_web_cms/js/fetchJsonData.js";
import {fillInputsWithData} from "./cabinet/fillInputsWithData.js";

const inputDisabled = document.querySelectorAll('.input-disabled');
const personalData = document.querySelector('#personal-data');
const personalDataDisabled = personalData.querySelectorAll('.input-disabled');
const personalDataChange = personalData.querySelector('.personal-data__change');
const personalDataChangeBtn = personalDataChange.querySelector('.btn__neutral');
const personalDataSave = personalData.querySelector('.personal-data__save');
const personalDataSaveBtn = personalDataSave.querySelector('.btn__save');
const personalDataCancelBtn = personalDataSave.querySelector('.btn__cancel');
document.querySelector('li.log-logout').style.display='none'

const data = await fetchJsonData('/cabinet_data/')
let personalDataInitial;
if (data.status === 'ok') {
    personalDataInitial = data.data['personalData'];
    fillInputsWithData(personalDataInitial, personalData);
}

[...inputDisabled].forEach(input => {
    input.disabled = true;
});

personalDataChangeBtn.addEventListener('click', (e) => {
    personalDataChange.classList.toggle('item-hidden');
    personalDataSave.classList.toggle('item-hidden');
    [...personalDataDisabled].forEach(input => {
        input.disabled = false;
    });
    personalData.querySelector(`#first-name`).focus();
});

personalDataCancelBtn.addEventListener('click', (e) => {
    personalDataChange.classList.toggle('item-hidden');
    personalDataSave.classList.toggle('item-hidden');
    [...personalDataDisabled].forEach(input => {
        input.disabled = true;
    });
    if(personalDataInitial) fillInputsWithData(personalDataInitial, personalData);
})