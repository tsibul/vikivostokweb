'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";

/**
 *
 * @param e
 * @param btn
 * @returns {Promise<void>}
 */
export async function saveCatalogueItem(e, btn) {
    btn.disabled = true;
    btn.classList.add('btn__disabled');
    const form = btn.closest('form')
    const rowId = form.querySelector('input[name="id"]').value;
    const newBtn = document.querySelector('.catalogue__title').querySelector('.btn__save');
    newBtn.disabled = false;
    newBtn.classList.remove('btn__disabled');
    const formData = new FormData(form);
    const formDataDict = Object.fromEntries(formData.entries());
    let dataDifferent = false;
    if (rowId !== '0') {
        const url = jsonUrl + 'catalogue_record/' + rowId;
        const item = await fetchJsonData(url);
        for (const key in formDataDict) {
            if (item.values[0][key] !== formDataDict[key]) {
                dataDifferent = true;
                break;
            }
        }
    }
    if (rowId === '0' || dataDifferent) {
        e.preventDefault();
        const saveUrl = jsonUrl + 'save_catalogue_item/' + rowId;
        await fetch(saveUrl, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(rowData => {
                if (rowId === '0')
                form.querySelector('input[name="id"]').value = rowData.id;
                // console.log(rowId);
                // console.log();
            });
    }
}