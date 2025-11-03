/**
 * @fileoverview Module for handling new items filtering
 * @module dictionaryElement/deletedFilter
 */

'use strict';

import {reloadContent} from "./reloadContent.js";
import {searchStringNormalizer} from "./searchStringNormalizer.js";
import {reloadCatalogue} from "../catalogueElement/reloadCatalogue.js";

/**
 * Reloads content when deleted items filter is changed
 * @param {string} className - Class name for selected dictionary
 * @param {HTMLInputElement} newCheck - Checkbox element for new items filter
 * @returns {Promise<void>}
 */
export async function newFilter(className, newCheck) {
    const dictionarySection = newCheck.closest('.dictionary-frame__header').parentElement;
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    const normalizedSearchString = searchStringNormalizer(searchString);
    const deletedCheck = dictionarySection.querySelector('.check-deleted');
    switch (className) {
        case 'Catalogue':
            await reloadCatalogue(dictionarySection, deletedCheck, newCheck, normalizedSearchString);
            break;
        default:
            await reloadContent(dictionarySection, className, deletedCheck, newCheck, normalizedSearchString);
    }
}