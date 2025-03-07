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
    const allItems = await fetchJsonData(jsonUrl +'all_items_all_items_for_dropdown')
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
        goodsRow = rowBuild(goodsItem, headerData, allItems);
        priceForm.appendChild(goodsRow);
        items = data['items'].filter(item => goodsItem['id'] === item['goods__id'].id);
        items.forEach(item => {
            itemRow = rowBuild(item, headerData);
            priceForm.appendChild(itemRow);
        });
    });


}

function rowBuild(rowData, headerData, allItems, rowType) {
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
            e.target.readOnly = false;
        });
        priceField.addEventListener('change', (e) => {
            e.target.readOnly = true;
        });
        if (priceField.dataset.discount === '1') {
            priceField.addEventListener('change', (e) => {
                const rowInputs = goodsRow.querySelectorAll('input[type="number"]');
                rowInputs.forEach(input => {
                    if (input.dataset.discount !== '1') {
                        input.value =  (Math.ceil(
                            e.target.value * Number.parseFloat(input.dataset.discount) * 100
                        ) / 100).toFixed(2);
                    }
                });
            });
        }
        goodsRow.appendChild(priceField);
    });
    const dropDownItems = allItems.filter(item => item.goods__id === rowData.id);
    goodsRow.appendChild(priceDropdownBody(dropDownItems));
    const itemBtn = createCancelButton('Добавить цвет');
    goodsRow.appendChild(itemBtn);

    return goodsRow;
}

