/**
 * @fileoverview Module for reloading price list content
 * @module priceElement/reloadPriceList
 */

'use strict'

import {createPriceContent} from "./createPriceContent.js";

/**
 * Reloads price list content with current filters
 * @param {Event} [e] - Optional event object
 * @returns {Promise<void>}
 */
export async function reloadPriceList(e) {
    const content = document.querySelector('.content');
    const dictionaryHeaderRight = content.querySelector('.dictionary-frame__header_right');
    const searchInput = dictionaryHeaderRight.querySelector('.dictionary-frame__input');
    const searchBtn = dictionaryHeaderRight.querySelector('.btn__save');
    searchInput.disabled = false;
    searchBtn.disabled = false;
    searchBtn.classList.remove('btn__disabled');
    const priceContent = content.querySelector('.price-block');
    const priceDate = content
        .querySelector('.dictionary-frame__header_left')
        .querySelector('.price-dropdown__input').value;
    const searchString = searchInput.value;
    const priceType = content
        .querySelector('.dictionary-frame__header_right')
        .querySelector('input[hidden]').value;
    if (priceContent) priceContent.innerHTML = '';
    const priceBlocks = await createPriceContent(priceDate, priceType, searchString);
    priceContent.appendChild(priceBlocks.header);
    priceContent.appendChild(priceBlocks.form);
}