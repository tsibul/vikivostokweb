'use strict'


import {createDictionaryContent} from "./showDictionary/createDictionaryContent.js";

/**
 * reload content for dictionarySection when query params changed
 * @param dictionarySection section to reload content
 * Queri parameters
 * @param className className of the dictionary
 * @param deletedCheck if deleted checked true
 * @param searchString value of searchString input
 * @returns {Promise<void>}
 */
export async function reloadContent(dictionarySection, className, deletedCheck, searchString) {
    let dictionaryContent = dictionarySection.querySelector('.dictionary-content');
    const rowGrid = dictionaryContent.dataset.grid;
    dictionaryContent.remove();
    dictionaryContent = await createDictionaryContent(className,
        rowGrid,
        deletedCheck.checked ? 0 : 1,
        searchString );
    dictionarySection.appendChild(dictionaryContent);
}