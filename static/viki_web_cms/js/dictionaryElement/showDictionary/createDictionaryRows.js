'use strict'

import {fetchJsonData} from "../../fetchJsonData.js";
import {jsonUrl} from "../../main.js";
import {createHEXSquare} from "./createHEXSquare.js";
import {addNext20Records} from "./addNext20Records.js";
import {createCancelButton} from "../../createStandardElements/createCancelButton.js";
import {openEditModal} from "../createInput/openEditModal.js";

/**
 * create rows for dictionary with sertan query
 * @param dictionaryClass
 * query
 * @param deleted if not show deleted
 * @param lastRecord last record number
 * @param searchString search string
 * @param rowGrid row grid style (string)
 * @returns {Promise<HTMLDivElement>}
 */
export async function createDictionaryRows(dictionaryClass, deleted, lastRecord, searchString, rowGrid) {
    const dictionaryRows = document.createElement('div');
    dictionaryRows.classList.add('dictionary-content__rows');
    const url = jsonUrl + 'field_values/' + dictionaryClass + '/' + deleted + '/' + lastRecord + '/' + searchString;
    const dictionaryValues = await fetchJsonData(url);
    let counter = 0;
    dictionaryValues.values.forEach(value => {
        let row = document.createElement('div');
        createRow(row, value, dictionaryValues.field_params);
        row.style.gridTemplateColumns = rowGrid;
        dictionaryRows.appendChild(row);
        counter++;
        if (counter === 20) {
            row.dataset.lastRecord = lastRecord + 20;
            row.addEventListener('mouseover', (e) =>
                addNext20Records(e.target, dictionaryClass,
                    deleted, searchString, lastRecord + 20));
        }
    })
    return dictionaryRows;
}

/**
 * create single row
 * @param row
 * @param value field information for row
 * @param fieldParams
 * @returns {HTMLDivElement}
 */
export function createRow(row, value, fieldParams) {
    row.classList.add('dictionary-content__row');
    const square = createHEXSquare();
    value.hex ? square.style.backgroundColor = value.hex : null;
    row.appendChild(square);
    row.id = 'row_' + value['id'];
    Object.keys(value).forEach((key, index) => {
        if (key !== 'id') {
            let itemDiv;
            if (Object.keys(fieldParams).includes(key) && fieldParams[key]['type'] === 'image') {
                itemDiv = document.createElement('img');
                itemDiv.classList.add('dictionary-content__row_img');
                itemDiv.src = fieldParams[key]['url'] + value[key];
                itemDiv.alt = value[key];
            } else {
                itemDiv = document.createElement('div');
                itemDiv.classList.add('dictionary-content__row_item');
                itemDiv.textContent = value[key];
            }
            row.appendChild(itemDiv)
        }
    })
    const newBtn = createCancelButton('Изм.');
    newBtn.dataset.itemId = value.id
    newBtn.addEventListener('click', (e) => openEditModal(e.target))
    row.appendChild(newBtn);
}