/**
 * @fileoverview Module for applying constructor changes to the product
 * @module constructor/applyConstructor
 */

'use strict'

import {changeFrameItem} from "../product/changeFrameItem.js";
import {closeConstructor} from "./closeConstructor.js";


/**
 * Applies selected constructor options to the product
 * @param {HTMLElement} modal - Constructor dialog element
 * @param {number} itemId - Product container element
 * @param {HTMLElement} currentFrame - Current product frame element
 */
export function applyConstructor(modal, itemId, currentFrame) {
    const imageItems = currentFrame
        .querySelectorAll(`div.product-hor__image-frame`);
    const currentItem = [...imageItems].find(elem => !elem.classList.contains('item-hidden'));

    const colorLabel = currentFrame.closest('.product')
        .querySelector(`label.color-label[data-id="${itemId}"]`);
    changeFrameItem(colorLabel, currentItem, itemId.toString())
    closeConstructor(modal);
}