'use strict'

import {jsonUrl} from "../main.js";
import {reloadPriceList} from "./reloadPriceList.js";

export async function savePrintingPriceList(e){
    const content = document.querySelector('.content');
    const priceDateId = content
        .querySelector('.dictionary-frame__header_left')
        .querySelector('input[hidden]').value;
    const changedFields = document
        .querySelectorAll('input.type-table__input:not(.price-row__item_disabled)');
    const priceListData = [];
    let priceListDataItem;
    [...changedFields].forEach(input => {
        priceListDataItem = {};
        Object.entries(input.dataset).forEach(([key, value]) => {
            if (Number.parseInt(value)) {
                priceListDataItem[key] = Number.parseInt(value)
            } else {
                priceListDataItem[key] = value;
            }
        })
        priceListDataItem['price_list__id'] = Number.parseInt(priceDateId);
        priceListDataItem['price'] = Number.parseFloat(input.value);
        priceListData.push(priceListDataItem);
    });
    const saveUrl = jsonUrl + 'printing_price_list_save'
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