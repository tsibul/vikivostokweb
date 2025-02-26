'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createCatalogueRow} from "./createCatalogueRow.js";

/**
 * create catalogue content
 * @param catalogueContent
 * @returns {Promise<void>}
 */
export async function createCatalogueContent(catalogueContent) {
    const url = jsonUrl + 'catalogue_data/0/0/None/0';
    const jsonData = await fetchJsonData(url);
    const itemData = jsonData.values;
    let newRow
    for (const item of itemData) {
        newRow = document.createElement('form');
        await createCatalogueRow(item, newRow)
        catalogueContent.appendChild(await newRow);
    }
}