/**
 * @fileoverview Module for reloading catalogue content
 * @module catalogueElement/reloadCatalogue
 */

'use strict'

import {createCatalogueContent} from "./createCatalogueContent.js";

/**
 * Reloads catalogue content with current filters
 * @param {HTMLElement} dictionarySection - Section containing the catalogue
 * @param {HTMLInputElement} deletedCheck - Checkbox for filtering deleted items
 * @param {string} searchString - Search string for filtering content
 * @returns {Promise<void>}
 */
export async function reloadCatalogue(dictionarySection, deletedCheck, searchString) {
    const catalogue = dictionarySection.querySelector('.catalogue__content');
    catalogue.innerHTML = '';
    await createCatalogueContent(catalogue, deletedCheck.checked ? 0 : 1, 0, searchString, 0);
}