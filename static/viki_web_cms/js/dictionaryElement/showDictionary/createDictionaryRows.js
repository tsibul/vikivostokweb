'use strict'

import {fetchJsonData} from "../../fetchJsonData.js";
import {jsonUrl} from "../../main.js";
import {createHEXSquare} from "./createHEXSquare.js";
import {addNext20Records} from "./addNext20Records.js";

export async function createDictionaryRows(dictionaryClass, deleted, lastRecord, searchString, rowGrid) {
    const dictionaryRows = document.createElement('div');
    dictionaryRows.classList.add('dictionary-content__rows');
    const url = jsonUrl + 'field_values/' + dictionaryClass + '/' + deleted + '/' + lastRecord + '/' + searchString;
    const dictionaryValues = await fetchJsonData(url);
    let counter = 0;
    dictionaryValues.values.forEach(value => {
        let row = createRow(value);
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

function createRow(value) {
    const row = document.createElement('div');
    row.classList.add('dictionary-content__row');
    const square = createHEXSquare();
    value.hex ? square.style.backgroundColor = value.hex : null;
    row.appendChild(square)
    Object.values(value).forEach((item, index) => {
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('dictionary-content__row_item');
        itemDiv.textContent = item;
        row.appendChild(itemDiv)
    })
    const newBtn = document.createElement("button");
    newBtn.classList.add('btn', 'btn__cancel');
    newBtn.textContent = 'Изм.';
    row.appendChild(newBtn);
    return row;
}