/**
 * @fileoverview Module for handling infinite scroll functionality in catalogue
 * @module catalogueElement/scrollRecords
 */

'use strict'

import {createCatalogueContent} from "./createCatalogueContent.js";
import {searchStringNormalizer} from "../dictionaryElement/searchStringNormalizer.js";

/**
 * Loads additional catalogue records when scrolling
 * @param {Event} e - Scroll event object
 * @returns {Promise<void>}
 */
export async function scrollRecords(e) {
    const currentRecord = e.target;
    const firstRecord = currentRecord.dataset.lastId;
    const content = currentRecord.closest('.content');
    const searchString = content.querySelector('.dictionary-frame__input').value;
    const deletedCheck = content.querySelector('.check-deleted');
    const newCheck = content.querySelector('.check-new');
    const catalogueContent= content.querySelector('.catalogue__content');
    await createCatalogueContent(catalogueContent, deletedCheck.checked ? 1 :0,
        newCheck.checked ? 1 :0, firstRecord,
        searchStringNormalizer(searchString), 0);
}