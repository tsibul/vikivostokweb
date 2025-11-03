/**
 * @fileoverview Module for handling printing price list functionality
 * @module priceElement/printingPrice
 */

'use strict'

import {jsonUrl} from "../main.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {savePrintingPriceList} from "./savePrintingPriceList.js";

/**
 * Creates price content element for printing price list
 * @param {string} priceDate - Price list date identifier
 * @param {string} [searchString] - Optional search string for filtering
 * @returns {Promise<{form: HTMLDivElement, header: HTMLElement}>} Object containing form and header elements
 */
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

/**
 * Builds header section for printing price list
 * @returns {Promise<HTMLDivElement>} Header element
 */
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

/**
 * Builds table header for a specific print type
 * @param {Object} printType - Print type data
 * @param {string} rowGrid - CSS grid template columns definition
 * @returns {HTMLDivElement} Table header element
 */
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

/**
 * Builds table row for a print group
 * @param {Object} group - Print group data
 * @param {string} rowGrid - CSS grid template columns definition
 * @param {Array<Object>} volumes - Array of volume data
 * @returns {HTMLDivElement} Table row element
 */
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

/**
 * Builds input element for a specific price in the table
 * @param {Object} group - Print group data
 * @param {Object} volume - Volume data
 * @returns {HTMLInputElement} Input element for price
 */
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
    rowItem.dataset.id = price ? price['price__id'] : '';
    rowItem.dataset.print_volume__id = volume.print_volume_id;
    rowItem.dataset.print_price_group__id = group.print_price_group__id;
    rowItem.value = price?.['price'];
    return rowItem;
}