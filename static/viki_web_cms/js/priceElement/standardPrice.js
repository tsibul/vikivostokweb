'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {priceDropdownBody} from "./priceDropdownBody.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";

export async function standardPrice(priceDate, searchString) {
    const priceForm = document.createElement('div');
    priceForm.classList.add('price-content');
    const priceUrl = jsonUrl + 'standard_price_data/' + priceDate + '/' + searchString;
    const priceData = await fetchJsonData(priceUrl);
    const allItems = await fetchJsonData(jsonUrl + 'all_items_all_items_for_dropdown')
    const priceHeader = priceHeaderBuild(priceData.header);
    await priceFormBuild(priceData.form, priceForm, priceData.header, allItems);
    return {'form': priceForm, 'header': priceHeader};
}

function priceHeaderBuild(headerData) {
    const priceHeader = document.createElement('header');
    priceHeader.classList.add('price-header');
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
    return priceHeader;
}

function priceFormBuild(data, priceForm, headerData, allItems) {
    let goodsRow, itemRow, items;
    data['goods'].forEach((goodsItem) => {
        goodsRow = goodsRowBuild(goodsItem, headerData, allItems);
        priceForm.appendChild(goodsRow);
        items = data['items'].filter(item => goodsItem['id'] === item['goods__id'].id);
        items.forEach(item => {
            itemRow = itemRowBuild(item, headerData);
            priceForm.appendChild(itemRow);
        });
    });


}

function goodsRowBuild(rowData, headerData, allItems) {
    const goodsRow = rowBuild(rowData, headerData, 'goods');
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

function itemRowBuild(rowData, headerData) {
    const itemRow = rowBuild(rowData, headerData, 'item');
    itemRow.classList.add('price-row__item-row');
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


function rowBuild(rowData, headerData, rowType) {
    const goodsRow = document.createElement('div');
    goodsRow.dataset.type = rowType
    goodsRow.classList.add('price-row');
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
        priceField.classList.add('price-row__item');
        priceField.type = 'number';
        priceField.step = '0.01';
        priceField.lang = 'en';
        const priceItem = JSON.parse(rowData.price).find(item => {
            return 'price_type__id' in item && item['price_type__id'] === element.price_name__id;
        });
        priceField.name = 'goods_' + rowData.id + '_' + element.price_name__id;
        priceField.dataset.priceType = element.price_name__id;
        priceField.dataset.discount = element.discount;
        priceField.value = priceItem ? priceItem['price'] : '';
        priceField.readOnly = true;
        priceField.addEventListener('dblclick', (e) => {
            const dictionaryHeaderRight = document.querySelector('.dictionary-frame__header_right');
            const searchInput = dictionaryHeaderRight.querySelector('.dictionary-frame__input');
            const searchBtn = dictionaryHeaderRight.querySelector('.btn__save');
            e.target.readOnly = false;
            searchInput.disabled = true;
            searchBtn.disabled = true;
            searchBtn.classList.add('btn__disabled');
        });
        priceField.addEventListener('change', (e) => {
            e.target.readOnly = true;
        });
        if (priceField.dataset.discount === '1') {
            priceField.addEventListener('change', (e) => {
                const rowInputs = goodsRow.querySelectorAll('input[type="number"]');
                rowInputs.forEach(input => {
                    if (input.dataset.discount !== '1') {
                        input.value = (Math.ceil(
                            e.target.value * Number.parseFloat(input.dataset.discount) * 100
                        ) / 100).toFixed(2);
                    }
                });
            });
        }
        goodsRow.appendChild(priceField);
    });
    return goodsRow;
}

