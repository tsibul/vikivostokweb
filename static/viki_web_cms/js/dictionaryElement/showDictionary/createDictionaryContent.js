'use strict'


import {createDictionaryTitle} from "./createDictionaryTitle.js";
import {createDictionaryRows} from "./createDictionaryRows.js";
import {getFieldStructure} from "../getFieldStructure.js";

/**
 * create dictionary content (create once)
 * @param elementClass dictionary class
 * @param rowGrid grid-template-columns style
 * Query params:
 * @param deleted if deleted checked true
 * @param newItem if newItem checked true
 * @param searchString value of searchString input
 * @returns {Promise<HTMLDivElement>}
 */
export async function createDictionaryContent(elementClass, rowGrid, deleted, newItem, searchString) {
    const titleObject = await getFieldStructure(elementClass);
    const outputContent = document.createElement('div');
    outputContent.classList.add('dictionary-content');
    const dictionaryTitle = await createDictionaryTitle(titleObject);
    dictionaryTitle.style.gridTemplateColumns = rowGrid;
    outputContent.appendChild(dictionaryTitle);
    const dictionaryRows = await createDictionaryRows(elementClass, deleted, newItem,0, searchString, rowGrid);
    outputContent.appendChild(dictionaryRows);
    outputContent.dataset.grid = rowGrid;
    return outputContent;
}