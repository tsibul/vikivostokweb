/**
 * @fileoverview Module for handling volume-based price list functionality
 * @module priceElement/volumePrice
 */

'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {priceHeaderBuild} from "./standardPrice.js";

/**
 * Creates price content element for volume-based price list
 * @param {string} priceDate - Price list date identifier
 * @param {string} [searchString] - Optional search string for filtering
 * @returns {Promise<{form: HTMLDivElement, header: HTMLElement}>} Object containing form and header elements
 */
export async function volumePrice(priceDate, searchString) {
    const priceForm = document.createElement('div');
    priceForm.classList.add('price-content');
    const priceUrl = jsonUrl + 'volume_price_data/' + priceDate + '/' + searchString;
    const priceData = await fetchJsonData(priceUrl);
    const rowGrid = '0.8fr 3.2fr repeat(' + priceData.price_type_length  + ', 1fr) 120px 102px'
    const priceHeader = await priceHeaderBuild(priceData.header, rowGrid);
    volumePriceFormBuild(priceData.form, priceForm, priceData.header, priceData.form.volumes, rowGrid);

    return {'form': priceForm, 'header': priceHeader};
}

/**
 * Builds form content for volume-based price list
 * @param {Object} priceData - Price data containing goods and volumes
 * @param {HTMLDivElement} priceForm - Form element to populate
 * @param {Array<Object>} header - Array of price type data
 * @param {Array<Object>} volumes - Array of volume data
 * @param {string} rowGrid - CSS grid template columns definition
 */
function volumePriceFormBuild(priceData, priceForm, header, volumes, rowGrid) {
    volumes.forEach(volume => {
        const tableHeader = document.createElement('div');
        tableHeader.classList.add('price-content__volume-header');
        tableHeader.textContent = 'Количество ' + volume.name + ' шт';
        priceForm.appendChild(tableHeader);
        const volumeTable = document.createElement('div');
        volumeTable.appendChild(createTableContent(priceData, header, volume, rowGrid));
        priceForm.appendChild(volumeTable);
    });

}

/**
 * Creates table content for a specific volume
 * @param {Object} priceData - Price data containing goods
 * @param {Array<Object>} header - Array of price type data
 * @param {Object} volume - Volume data
 * @param {string} rowGrid - CSS grid template columns definition
 * @returns {HTMLDivElement} Table content element
 */
function createTableContent(priceData, header, volume, rowGrid) {
    const tableContent = document.createElement('div');
    priceData.goods.forEach((g) => {
        tableContent.appendChild(createVolumeRow(g, header, volume, rowGrid));
    });
    return tableContent;
}

/**
 * Creates row for volume-based price list
 * @param {Object} g - Goods data
 * @param {Array<Object>} header - Array of price type data
 * @param {Object} volume - Volume data
 * @param {string} rowGrid - CSS grid template columns definition
 * @returns {HTMLDivElement} Row element
 */
function createVolumeRow(g, header, volume, rowGrid) {
    const volumeRow = document.createElement('div');
    volumeRow.classList.add('price-row');
    volumeRow.style.gridTemplateColumns = rowGrid;
    const idField = document.createElement('input');
    idField.type = 'text';
    idField.hidden = true;
    idField.name = 'id'
    idField.value = g.id;
    volumeRow.appendChild(idField);
    const articleField = document.createElement('div');
    articleField.classList.add('price-row__name');
    articleField.textContent = g.article;
    volumeRow.appendChild(articleField);
    const nameField = document.createElement('div');
    nameField.classList.add('price-row__name');
    nameField.textContent = g.name;
    volumeRow.appendChild(nameField);
    let priceField;
    header.forEach(element => {
        priceField = document.createElement('input');
        priceField.classList.add('price-row__item', 'price-row__item_disabled');
        priceField.type = 'number';
        priceField.step = '0.01';
        priceField.lang = 'en';
        const priceItem = JSON.parse(g.price).find(item => {
            return 'price_type__id' in item &&
                item['price_type__id'] === element.price_name__id &&
                item['price_volume__id'] === volume['id'];
        });
        priceField.dataset.class = 'goods';
        priceField.dataset.id = priceItem ? priceItem['id'] : '';
        priceField.setAttribute('data-goods__goods__id', g.id);
        priceField.dataset.standard_price_type__price_type__id = element.price_name__id;
        priceField.dataset.price_goods_quantity__price_volume__id = volume['id'];
        priceField.value = priceItem ? priceItem['price'] : '';
        priceField.readOnly = true;
        priceField.addEventListener('dblclick', (e) => {
            const dictionaryHeaderRight = document.querySelector('.dictionary-frame__header_right');
            const searchInput = dictionaryHeaderRight.querySelector('.dictionary-frame__input');
            const searchBtn = dictionaryHeaderRight.querySelector('.btn__save');
            e.target.readOnly = false;
            e.target.classList.remove('price-row__item_disabled');
            searchInput.disabled = true;
            searchBtn.disabled = true;
            searchBtn.classList.add('btn__disabled');
        });
        priceField.addEventListener('change', (e) => {
            e.target.readOnly = true;
        });
        volumeRow.appendChild(priceField);
    });
    return volumeRow;
}

