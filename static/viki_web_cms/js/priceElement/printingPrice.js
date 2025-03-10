'use strict'

import {jsonUrl} from "../main.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {savePrintingPriceList} from "./savePrintingPriceList.js";

export async function printingPrice(priceDate, searchString) {
    const dictionaryHeaderRight = document.querySelector('.dictionary-frame__header_right');
    const searchInput = dictionaryHeaderRight.querySelector('.dictionary-frame__input');
    const searchBtn = dictionaryHeaderRight.querySelector('.btn__save');
    const clearSearch = dictionaryHeaderRight.querySelector('.btn__cancel');
    searchInput.disabled = true;
    searchBtn.disabled = true;
    searchBtn.classList.add('btn__disabled');
    clearSearch.disabled = true;
    clearSearch.classList.add('btn__disabled');

    const priceForm = document.createElement('div');
    priceForm.classList.add('price-content');
    const priceHeader = await buildPriceHeader();
    const priceUrl = jsonUrl + 'printing_price_data/' + priceDate + '/' + searchString;
    const printPriceData = await fetchJsonData(priceUrl);
    return {'form': priceForm, 'header': priceHeader};
}


async function buildPriceHeader() {
    const priceHeader = document.createElement('div');
    priceHeader.classList.add('print-header');
    const loadBtn = createNeutralButton('Загрузить csv');
    priceHeader.appendChild(loadBtn);
    const saveBtn = createSaveButton('Сохранить');
    priceHeader.appendChild(saveBtn);
    saveBtn.addEventListener('click', await savePrintingPriceList);
    return priceHeader;
}