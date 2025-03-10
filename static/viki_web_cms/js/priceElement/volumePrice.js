'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {priceHeaderBuild} from "./standardPrice.js";

export async function volumePrice(priceDate, searchString) {
    const priceForm = document.createElement('div');
    priceForm.classList.add('price-content');
    const priceUrl = jsonUrl + 'volume_price_data/' + priceDate + '/' + searchString;
    const priceData = await fetchJsonData(priceUrl);
    const priceHeader = await priceHeaderBuild(priceData.header);
    volumePriceFormBuild(priceData.form, priceForm, priceData.header, priceData.form.volumes);

    return {'form': priceForm, 'header': priceHeader};
}

function volumePriceFormBuild(priceData, priceForm, header, volumes) {
    volumes.forEach(volume => {
        const tableHeader = document.createElement('div');
        tableHeader.classList.add('price-content__volume-header');
        tableHeader.textContent = 'Количество ' + volume.name + ' шт';
        priceForm.appendChild(tableHeader);
        const volumeTable = document.createElement('div');
        volumeTable.appendChild(createTableContent(priceData, header, volume));
        priceForm.appendChild(volumeTable);
    });

}

function createTableContent(priceData, header, volume) {
    const tableContent = document.createElement('div');
    priceData.goods.forEach((g) => {
        tableContent.appendChild(createVolumeRow(g, header, volume));
    });
    return tableContent;
}


function createVolumeRow(g, header, volume) {
    const volumeRow = document.createElement('div');
    volumeRow.classList.add('price-row');
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

