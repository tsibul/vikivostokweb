'use strict'

import {jsonUrl} from "../main.js";
import {reloadPriceList} from "./reloadPriceList.js";

/**
 * save priceList for standard prices
 * @param e
 * @returns {Promise<void>}
 */
export async function savePriceList(e) {
    const content = document.querySelector('.content');
    const priceDateId = content
        .querySelector('.dictionary-frame__header_left')
        .querySelector('input[hidden]').value;
    const priceTypeId = content
        .querySelector('.dictionary-frame__header_right')
        .querySelector('input[hidden]').value;
    const changedFields = document
        .querySelectorAll('input.price-row__item:not(.price-row__item_disabled)');
    const inputsToSave = Array.from(changedFields);
        // .filter(input => input.value.trim() !== '' && input.value !== '0');
    const priceListData = {'goods': [], 'item': []};
    let priceListDataItem;
    inputsToSave.forEach(input => {
        priceListDataItem = {};
        Object.entries(input.dataset).forEach(([key, value]) => {
            if (Number.parseInt(value)) {
                priceListDataItem[key] = Number.parseInt(value)
            } else {
                priceListDataItem[key] = value;
            }
        })
        // priceListDataItem = JSON.parse(JSON.stringify(input.dataset));
        priceListDataItem['Price__price_list__id'] = Number.parseInt(priceDateId);
        priceListDataItem['price'] = Number.parseFloat(input.value);
        delete priceListDataItem['discount'];
        priceListData[input.dataset.class].push(priceListDataItem);
        delete priceListDataItem['class'];
    });
    const saveUrl = jsonUrl + 'price_list_save'
    fetch(saveUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(priceListData),
    })
    .then(res => res.json())
    .then(data => {
        const err = data.error;
        if (!err) reloadPriceList()
    });
}
