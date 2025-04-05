/**
 * @fileoverview Module for creating catalogue content with rows
 * @module catalogueElement/createCatalogueContent
 */

'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createCatalogueRow} from "./createCatalogueRow.js";
import {scrollRecords} from "./scrollRecords.js";

/**
 * Creates catalogue content with rows of items
 * @param {HTMLDivElement} catalogueContent - Container for catalogue rows
 * @param {number} deletedCheck - Flag for filtering deleted items (0: not deleted, 1: deleted)
 * @param {number} firstRecord - ID of the first record to display
 * @param {string} searchString - Search string for filtering content
 * @param {number} order - Order parameter for sorting
 * @returns {Promise<void>}
 */
export async function createCatalogueContent(catalogueContent, deletedCheck, firstRecord, searchString, order) {
    const url = jsonUrl + 'catalogue_data/' + deletedCheck + '/' + firstRecord + '/'
        + searchString + '/' + order;
    const jsonData = await fetchJsonData(url);
    const itemData = jsonData.values;
    let newRow;
    let counter = 0;
    const firstRow = catalogueContent.querySelector(`form[data-last-id="${firstRecord}"]`);
    firstRow ? firstRow.removeEventListener('mouseover', scrollRecords) : null;
    for (const item of itemData) {
        newRow = document.createElement('form');
        await createCatalogueRow(item, newRow)
        catalogueContent.appendChild(await newRow);
        counter++;
        if (counter === 20) {
            newRow.dataset.lastId = Number.parseInt(firstRecord) + counter;
            newRow.addEventListener('mouseover', scrollRecords);
        }
    }
}