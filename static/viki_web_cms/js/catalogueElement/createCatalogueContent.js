'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createCatalogueRow} from "./createCatalogueRow.js";

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
    let newRow
    for (const item of itemData) {
        newRow = document.createElement('form');
        await createCatalogueRow(item, newRow)
        catalogueContent.appendChild(await newRow);
    }
}