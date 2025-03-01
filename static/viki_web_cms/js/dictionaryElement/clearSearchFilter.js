'use strict'


import {reloadContent} from "./reloadContent.js";
import {reloadCatalogue} from "../catalogueElement/reloadCatalogue.js";

/**
 * clear searchString on click and remove search results
 * @param button
 * @param className
 * @returns {Promise<void>}
 */
export async function clearSearchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame__header').parentElement;
    dictionarySection.querySelector('.dictionary-frame__input').value = '';
    const deletedCheck = dictionarySection.querySelector('.check');
    switch (className) {
        case 'Catalogue':
            await reloadCatalogue(dictionarySection, deletedCheck, 'None');
            break;
        default:
            await reloadContent(dictionarySection, className, deletedCheck, 'None');
    }
}