'use strict'

import {createPriceContent} from "./createPriceContent.js";

export async function reloadPriceList(e) {
    const content = e.target.closest('.content');
    const priceContent = content.querySelector('.price-block');
    const priceDate = content
        .querySelector('.dictionary-frame__header_left')
        .querySelector('.price-dropdown__input').value;
    const searchString = content.querySelector('.dictionary-frame__input').value;
    const priceType = content
        .querySelector('.dictionary-frame__header_right')
        .querySelector('input[hidden]').value;
    priceContent.innerHTML = '';
    const priceBlocks = await createPriceContent(priceDate, priceType, searchString);
    priceContent.appendChild(priceBlocks.header);
    priceContent.appendChild(priceBlocks.form);
}