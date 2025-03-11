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
    const priceUrl = jsonUrl + 'printing_price_data/' + priceDate;
    const printPriceData = await fetchJsonData(priceUrl);
    let rowGrid;
    printPriceData.priceData.forEach((printType) => {
        const typeTable = document.createElement('div');
        typeTable.classList.add('type-table');
        rowGrid = '2fr repeat(' + printType.print_volume_length + ', 1fr)';
        typeTable.appendChild(buildTableHeader(printType, rowGrid));
        printType.print_groups.forEach(group => {
            typeTable.appendChild(buildTableRow(group, rowGrid, printType.print_volume_data));
        })
        priceForm.appendChild(typeTable);

    })
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


function buildTableHeader(printType, rowGrid) {
    let titleItem
    const tableHeader = document.createElement('div');
    tableHeader.classList.add('type-table__row', 'type-table__header');
    tableHeader.style.gridTemplateColumns = rowGrid;
    titleItem = document.createElement('div');
    tableHeader.appendChild(titleItem);
    titleItem.textContent = printType.print_type__name;
    printType.print_volume_data.forEach(volume => {
        titleItem = document.createElement('div');
        titleItem.textContent = 'до ' + volume.quantity;
        tableHeader.appendChild(titleItem);
    });
    return tableHeader;
}

function buildTableRow(group, rowGrid, volumes) {
            const tableRow = document.createElement('div');
            tableRow.classList.add('type-table__row');
            tableRow.style.gridTemplateColumns = rowGrid;
            const rowItem = document.createElement('div');
            rowItem.classList.add('type-table__item');
            rowItem.textContent = group.print_price_group__name;
            tableRow.appendChild(rowItem);
            volumes.forEach(volume => {
                tableRow.appendChild(buildRowItem(group, volume));
            })
            return tableRow;
}


function buildRowItem(group,volume) {
    const rowItem = document.createElement('input');
    rowItem.type = 'number';
    rowItem.classList.add('type-table__input', 'price-row__item_disabled');
    rowItem.readOnly = true;
    rowItem.addEventListener('dblclick', (e) => {
        e.target.readOnly = false;
        e.target.classList.remove('price-row__item_disabled');
    });
    const price = group.prices.find(price => price['print_volume__id'] === volume.print_volume_id);
    rowItem.dataset.id = price && 'id' in Object.keys(price) ? price['id'] : '';
    rowItem.dataset.print_volume__id = volume.print_volume_id;
    rowItem.dataset.print_price_group__id = group.print_price_group__id;
    rowItem.value = price?.['price'];
    return rowItem;
}