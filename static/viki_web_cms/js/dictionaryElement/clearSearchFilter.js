'use strict'


import {reloadContent} from "./reloadContent.js";

/**
 * clear searchString on click and remove search results
 * @param button
 * @param className
 * @returns {Promise<void>}
 */
export async function clearSearchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame');
    dictionarySection.querySelector('.dictionary-frame__input').value = '';
    const deletedCheck = dictionarySection.querySelector('.check');
    await reloadContent(dictionarySection, className, deletedCheck, 'None');
}