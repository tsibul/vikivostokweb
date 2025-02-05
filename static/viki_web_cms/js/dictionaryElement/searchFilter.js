'use strict'

import {reloadContent} from "./reloadContent.js";

export async function searchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame');
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    const deletedCheck = dictionarySection.querySelector('.check');
    await reloadContent(dictionarySection, className, deletedCheck, searchString);
}