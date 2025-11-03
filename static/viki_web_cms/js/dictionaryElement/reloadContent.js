/**
 * @fileoverview Module for reloading dictionary content
 * @module dictionaryElement/reloadContent
 */

'use strict'

import {createDictionaryContent} from "./showDictionary/createDictionaryContent.js";

/**
 * Reloads content for dictionary section when query parameters change
 * @param {HTMLElement} dictionarySection - Section to reload content
 * @param {string} className - Class name of the dictionary
 * @param {HTMLInputElement} deletedCheck - Checkbox for deleted items filter
 * @param  {HTMLInputElement} newCheck - Checkbox for new items filter
 * @param {string} searchString - Value of search string input
 * @returns {Promise<void>}
 */
export async function reloadContent(dictionarySection, className,
                                    deletedCheck, newCheck, searchString) {
    let dictionaryContent = dictionarySection.querySelector('.dictionary-content');
    const rowGrid = dictionaryContent.dataset.grid;
    dictionaryContent.remove();
    const newCheckData = newCheck && newCheck.checked ? 1 : 0;
    dictionaryContent = await createDictionaryContent(className,
        rowGrid,
        deletedCheck.checked ? 0 : 1,
        newCheckData,
        searchString);
    dictionarySection.appendChild(dictionaryContent);
}