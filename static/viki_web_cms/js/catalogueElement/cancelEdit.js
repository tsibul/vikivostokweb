'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createCatalogueRow} from "./createCatalogueRow.js";

/**
 * remove new row, return previous data to edited row
 * @param e
 * @returns {Promise<void>}
 */
export async function cancelEdit(e){
    const form = e.target.closest('form')
    const rowId= form.querySelector('input[name="id"]').value;
    if (rowId === '0') {
        form.remove();
        const newBtn = document.querySelector('.catalogue__title').querySelector('.btn__save');
        newBtn.disabled = false;
        newBtn.classList.remove('btn__disabled');
    } else {
        form.innerHTML = ''
        const url = jsonUrl + 'catalogue_record/' + rowId;
        const item = await fetchJsonData(url);
        await createCatalogueRow(item[0], form);
    }
}