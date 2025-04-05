/**
 * @fileoverview Module for clearing search filters
 * @module dictionaryElement/clearSearchFilter
 */

'use strict'

import {reloadContent} from "./reloadContent.js";
import {reloadCatalogue} from "../catalogueElement/reloadCatalogue.js";

/**
 * Clears search string and removes search results
 * @param {HTMLButtonElement} button - Clear button element
 * @param {string} className - Class name of the dictionary section
 * @returns {Promise<void>}
 */
export async function clearSearchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame__header').parentElement;
    dictionarySection.querySelector('.dictionary-frame__input').value = '';
    const deletedCheck = dictionarySection.querySelector('.check-deleted');
    const newCheck = dictionarySection.querySelector('.check-new');
    switch (className) {
        case 'Catalogue':
            await reloadCatalogue(dictionarySection, deletedCheck, newCheck, 'None');
            break;
        default:
            await reloadContent(dictionarySection, className, deletedCheck, newCheck, 'None');
    }
}