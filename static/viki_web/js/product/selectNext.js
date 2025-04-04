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
    const currentItem = this.closest('.product-frame');
    const currentInList = idList.indexOf(idList.find(elem => elem.toString() === currentItem.dataset.id));
    const newItemId = currentInList === idList.length - 1 ? idList['0'] : idList[currentInList + 1];
    const newColorLabel = currentItem.querySelector(`label.color-label[data-item-id="${newItemId}"]`);
    if (idList.length > 1) {
        changeFrameItem(newColorLabel, currentItem, newItemId);
    }
}