'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createCatalogueRow} from "./createCatalogueRow.js";
import {scrollRecords} from "./scrollRecords.js";

/**
 * create catalogue content
 * @param catalogueContent
 * @param deletedCheck
 * @param firstRecord
 * @param searchString
 * @param order
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