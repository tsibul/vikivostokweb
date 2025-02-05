'use strict'


import {reloadContent} from "./reloadContent.js";

export async function clearSearchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame');
    dictionarySection.querySelector('.dictionary-frame__input').value = '';
    const deletedCheck = dictionarySection.querySelector('.check');
    await reloadContent(dictionarySection, className, deletedCheck, '');
}