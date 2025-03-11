'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {priceDropdownBody} from "./priceDropdownBody.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {savePriceList} from "./savePriceList.js";

/**
 * create price-content element for standard price
 * @param priceDate price list date
 * @param searchString search string (optional)
 * @returns {Promise<{form: HTMLDivElement, header: HTMLElement}>}
 */
export async function standardPrice(priceDate, searchString) {
    const priceForm = document.createElement('div');
    priceForm.classList.add('price-content');
    const priceUrl = jsonUrl + 'standard_price_data/' + priceDate + '/' + searchString;
    const priceData = await fetchJsonData(priceUrl);
    const rowGrid = '0.8fr 3.2fr repeat(' + priceData.price_type_length + ', 1fr) 160px 120px'
    const allItems = await fetchJsonData(jsonUrl + 'all_items_all_items_for_dropdown')
    const priceHeader = await priceHeaderBuild(priceData.header, rowGrid);
    await priceFormBuild(priceData.form, priceForm, priceData.header, allItems, rowGrid);
    return {'form': priceForm, 'header': priceHeader};
}

/**
 * build header for standard prices
 * @param headerData
 * @param rowGrid
 * @returns {Promise<HTMLElement>}
 */
export async function priceHeaderBuild(headerData, rowGrid) {
    const priceHeader = document.createElement('header');
    priceHeader.classList.add('price-header');
    priceHeader.style.gridTemplateColumns = rowGrid;
    const article = document.createElement('div');
    article.classList.add('price-header__item');
    article.textContent = 'Артикул';
    priceHeader.appendChild(article);
    const itemName = document.createElement('div');
    itemName.classList.add('price-header__item');
    itemName.textContent = 'Товар';
    priceHeader.appendChild(itemName);
    let priceType;
    headerData.forEach(element => {
        priceType = document.createElement('div');
        priceType.textContent = element.price_name__name;
        priceType.classList.add('price-header__item');
        priceHeader.appendChild(priceType);
    });
    const loadBtn = createNeutralButton('Загрузить csv');
    priceHeader.appendChild(loadBtn);
    const saveBtn = createSaveButton('Сохранить');
    priceHeader.appendChild(saveBtn);
    saveBtn.addEventListener('click', await savePriceList);
    return priceHeader;
}

/**
 * build content for priceForm
 * @param data
 * @param priceForm
 * @param headerData
 * @param allItems
 * @param rowGrid
 */
function priceFormBuild(data, priceForm, headerData, allItems, rowGrid) {
    let goodsRow, itemRow, items;
    data['goods'].forEach((goodsItem) => {
        goodsRow = goodsRowBuild(goodsItem, headerData, allItems, rowGrid);
        priceForm.appendChild(goodsRow);
        items = data['items'].filter(item => goodsItem['id'] === item['goods__id'] && item['price'] !== '[]');
        items.forEach(item => {
            itemRow = itemRowBuild(item, headerData, rowGrid);
            priceForm.appendChild(itemRow);
        });
    });


}

/**
 * build row for goods
 * @param rowData
 * @param headerData
 * @param allItems
 * @param rowGrid
 * @returns {HTMLDivElement}
 */
function goodsRowBuild(rowData, headerData, allItems, rowGrid) {
    const goodsRow = rowBuild(rowData, headerData, 'goods', 'goods', rowGrid);
    const dropDownItems = allItems.filter(item => item.goods__id === rowData.id);
    goodsRow.appendChild(priceDropdownBody(dropDownItems));
    const itemBtn = createCancelButton('Добавить цвет');
    itemBtn.addEventListener('click', () => {
        const newItemId = goodsRow
            .querySelector('.price-dropdown')
            .querySelector('input[hidden]')
            .value;
        const newItemName = goodsRow
            .querySelector('.price-dropdown__input')
            .value;
        const [article, ...rest] = newItemName.split(' ');
        const oldArticle = Array.from(document
            .querySelectorAll('div[data-type="item"] input[hidden]'))
            .find(input => input.value === newItemId);
        if (!oldArticle) {
            const newItemData = {
                'id': newItemId,
                'article': article,
                'name': rest.join(' '),
                'price': "[]"
            }
            goodsRow.insertAdjacentElement('afterend', itemRowBuild(newItemData, headerData));
        }
    });
    goodsRow.appendChild(itemBtn);
    return goodsRow;
}

/**
 * build row for CatalogueItem
 * @param rowData
 * @param headerData
 * @param rowGrid
 * @returns {HTMLDivElement}
 */
function itemRowBuild(rowData, headerData, rowGrid) {
    const itemRow = rowBuild(rowData, headerData, 'item', 'catalogue_item', rowGrid);
    itemRow.classList.add('price-row__item-row');
    itemRow.style.gridTemplateColumns = rowGrid;
    const itemBtn = createCancelButton('Убрать позицию');
    itemBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const rowId = itemRow.querySelector('input[name="id"]').value;
        fetch(jsonUrl + 'delete_item_price_row/' + rowId)
            .then(res => res.json())
            .then(data => {
                if (data) itemRow.remove();
            });
    });
    itemRow.appendChild(itemBtn);
    return itemRow;
}


/**
 * build row according rowType
 * @param rowData
 * @param headerData
 * @param rowType
 * @param typeClass
 * @param rowGrid
 * @returns {HTMLDivElement}
 */
function rowBuild(rowData, headerData, rowType, typeClass, rowGrid) {
    const goodsRow = document.createElement('div');
    goodsRow.dataset.type = rowType
    goodsRow.classList.add('price-row');
    goodsRow.style.gridTemplateColumns = rowGrid;
    const idField = document.createElement('input');
    idField.type = 'text';
    idField.hidden = true;
    idField.name = 'id'
    idField.value = rowData.id;
    goodsRow.appendChild(idField);
    const articleField = document.createElement('div');
    articleField.classList.add('price-row__name');
    articleField.textContent = rowData.article;
    goodsRow.appendChild(articleField);
    const nameField = document.createElement('div');
    nameField.classList.add('price-row__name');
    nameField.textContent = rowData.name;
    goodsRow.appendChild(nameField);
    let priceField;
    headerData.forEach(element => {
        priceField = document.createElement('input');
        priceField.classList.add('price-row__item', 'price-row__item_disabled');
        priceField.type = 'number';
        priceField.step = '0.01';
        priceField.lang = 'en';
        const priceItem = JSON.parse(rowData.price).find(item => {
            return 'price_type__id' in item && item['price_type__id'] === element.price_name__id;
        });
        // priceField.name = 'goods_' + rowData.id + '_' + element.price_name__id;
        priceField.dataset.class = rowType;
        priceField.dataset.id = priceItem ? priceItem['id'] : '';
        priceField.setAttribute('data-' + typeClass + '__' + rowType + '__id', rowData.id);
        // priceField.setAttribute('data-StandardPriceType__price_type__id', element.price_name__id)
        priceField.dataset.standard_price_type__price_type__id = element.price_name__id;
        priceField.dataset.discount = element.discount;
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
            // e.target.classList.remove('price-row__item_disabled');
        });
        if (priceField.dataset.discount === '1') {
            priceField.addEventListener('change', (e) => {
                const rowInputs = goodsRow.querySelectorAll('input[type="number"]');
                rowInputs.forEach(input => {
                    if (input.dataset.discount !== '1') {
                        input.value = (Math.ceil(
                            e.target.value * Number.parseFloat(input.dataset.discount) * 100
                        ) / 100).toFixed(2);
                        input.dispatchEvent(new Event('dblclick', {bubbles: true}));
                        e.target.classList.remove('price-row__item_disabled');
                    }
                });
            });
        }
        goodsRow.appendChild(priceField);
    });
    return goodsRow;
}