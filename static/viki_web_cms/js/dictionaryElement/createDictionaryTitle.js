'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {gridDictionaryStyle} from "./gridDictonaryStyle.js";

export async function createDictionaryTitle(dictionaryClass) {
    const dictionaryTitle = document.createElement('div');
    dictionaryTitle.classList.add('dictionary-content__title');
    const url = jsonUrl + 'field_names/' + dictionaryClass;
    const titleObject = await fetchJsonData(url);
    gridDictionaryStyle(dictionaryTitle, titleObject);
    titleObject.forEach(title => {
        let titleItem = document.createElement("div");
        titleItem.classList.add('dictionary-content__title_item');
        titleItem.textContent = title['label'];
        dictionaryTitle.appendChild(titleItem);
    });
    const newBtn = document.createElement("button");
    newBtn.classList.add('btn', 'btn__save');
    newBtn.textContent = 'Создать';
    dictionaryTitle.appendChild(newBtn);
    return dictionaryTitle;
}

