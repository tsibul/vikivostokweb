/**
 * @fileoverview Module for handling next item selection in product gallery
 * @module product/selectNext
 */

'use strict'

import {changeFrameItem} from "./changeFrameItem.js";

/**
 * Selects the next item in the product gallery
 * @param {Event} e - Click event on the next button
 */
export function selectNext(e) {
    const idList = JSON.parse(this.dataset.list);
    const imageItems = this.closest('.product-frame')
        .querySelectorAll(`div.product-hor__image-frame`);
    const currentItem = [...imageItems].find(elem => !elem.classList.contains('item-hidden'));
    const currentInList = idList.indexOf(idList.find(elem => elem.toString() === currentItem.dataset.id));
    const newItemId = currentInList === idList.length - 1 ? idList['0'] : idList[currentInList + 1];
    const newColorLabel = this.closest('.product').querySelector(`label.color-label[data-id="${newItemId}"]`);
    const colorPickerContainer = newColorLabel.closest('.color-padding');
    const colorPickerAll = colorPickerContainer.querySelectorAll(`div.color-label__check`);
    [...colorPickerAll].forEach(color => {
        color.removeAttribute('style');
    });
    newColorLabel.querySelector('.color-label__check').setAttribute('style', 'display: block;');
    if (idList.length > 1) {
        changeFrameItem(newColorLabel, currentItem, newItemId);
    }
}