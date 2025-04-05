/**
 * @fileoverview Module for handling search filtering
 * @module dictionaryElement/searchFilter
 */

'use strict'

import {reloadContent} from "./reloadContent.js";
import {searchStringNormalizer} from "./searchStringNormalizer.js";
import {reloadCatalogue} from "../catalogueElement/reloadCatalogue.js";

/**
 * Reloads dictionary content when search button is clicked
 * @param {HTMLButtonElement} button - Search button element
 * @param {string} className - Class name of the dictionary section
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