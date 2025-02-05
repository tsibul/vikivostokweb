'use strict'

import {fetchJsonData} from "../../fetchJsonData.js";
import {jsonUrl} from "../../main.js";
import {createHEXSquare} from "./createHEXSquare.js";

export async function createDictionaryRows(dictionaryClass, deleted, lastRecord, searchString) {
    const dictionaryRows = document.createElement('div');
    dictionaryRows.classList.add('dictionary-content__title');
    const url = jsonUrl + 'field_values/' + dictionaryClass + '/' + deleted + '/' + lastRecord + '/' + searchString;
    const dictionaryValues = await fetchJsonData(url);
    dictionaryValues.values.forEach(value => {
        let square = createHEXSquare();
        value.hex ? square.style.backgroundColor = value.hex : null;
        dictionaryRows.appendChild(square)
        Object.values(value).forEach((item, index) => {
            let itemDiv = document.createElement('div');
            itemDiv.classList.add('dictionary-content__row_item');
            itemDiv.textContent = item;
            dictionaryRows.appendChild(itemDiv)
        })
        let newBtn = document.createElement("button");
        newBtn.classList.add('btn', 'btn__cancel');
        newBtn.textContent = 'Изм.';
        dictionaryRows.appendChild(newBtn);
    })

    return dictionaryRows;
}