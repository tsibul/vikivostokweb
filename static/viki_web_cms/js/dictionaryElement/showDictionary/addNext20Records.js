'use strict'

import {createDictionaryRows} from "./createDictionaryRows.js";
import {gridDictionaryStyle} from "./gridDictonaryStyle.js";
import {getFieldStructure} from "../getFieldStructure.js";

/**
 * add 20 records to dictionary screen when mouseover on element
 * @param element row: mouseover causes function
 * Query parameters for backend
 * @param className className of the dictionary
 * @param deleted if deleted checked true
 * @param searchString value of searchString input
 * @param lastRecord number of lastRecord of dictionary showed
 * @returns {Promise<void>}
 */
export async function addNext20Records(element, className, deleted, searchString, lastRecord) {
    const titleObject = await getFieldStructure(className);
    const rowGrid = gridDictionaryStyle(titleObject);
    const dictionaryRows = element.closest('.dictionary-content__rows')
    const newRows = await createDictionaryRows(className, deleted,
        lastRecord, searchString, rowGrid);
    const newRowsList = newRows.children;
    [...newRowsList].forEach((el) => {
        dictionaryRows.appendChild(el);
    });
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
}
