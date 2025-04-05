/**
 * @fileoverview Module for handling deleted items filtering
 * @module dictionaryElement/deletedFilter
 */

'use strict';

import {reloadContent} from "./reloadContent.js";
import {searchStringNormalizer} from "./searchStringNormalizer.js";
import {reloadCatalogue} from "../catalogueElement/reloadCatalogue.js";

/**
 * Reloads content when deleted items filter is changed
 * @param {string} className - Class name for selected dictionary
 * @param {HTMLInputElement} deletedCheck - Checkbox element for deleted items filter
 * @returns {Promise<void>}
 */
export async function deletedFilter(className, deletedCheck) {
    const dictionarySection = deletedCheck.closest('.dictionary-frame__header').parentElement;
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    const normalizedSearchString = searchStringNormalizer(searchString);
    switch (className) {
        case 'Catalogue':
            await reloadCatalogue(dictionarySection, deletedCheck, normalizedSearchString);
            break;
        default:
            await reloadContent(dictionarySection, className, deletedCheck, normalizedSearchString);
    }
}