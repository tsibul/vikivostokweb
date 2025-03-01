'use strict'

import {reloadContent} from "./reloadContent.js";
import {searchStringNormalizer} from "./searchStringNormalizer.js";
import {reloadCatalogue} from "../catalogueElement/reloadCatalogue.js";

/**
 * reload dictionary content onclick search button
 * @param button search button
 * @param className
 * @returns {Promise<void>}
 */
export async function searchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame__header').parentElement;
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    const deletedCheck = dictionarySection.querySelector('.check');
    switch (className) {
        case 'Catalogue':
            await reloadCatalogue(dictionarySection, deletedCheck, searchStringNormalizer(searchString));
            break;
        default:
            await reloadContent(dictionarySection, className, deletedCheck, searchStringNormalizer(searchString));
    }
}