/**
 * @fileoverview Module for handling product color selection
 * @module product/selectItemColor
 */

'use strict'

import {changeFrameItem} from "./changeFrameItem.js";

/**
 * Handles color selection for a product item
 * @param {Event} e - Click event on the color label
 */
export function selectItemColor(e) {
    const labelCheck = this.querySelector('.color-label__check');
    const imageItems = this.closest('.product')
        .querySelectorAll(`div.product-hor__image-frame`);
    const currentItem = [...imageItems].find(elem => !elem.classList.contains('item-hidden'));
    if (labelCheck.style.display === '') {
        const colorPickerContainer = e.target.closest('.color-padding');
        const colorPickerAll = colorPickerContainer.querySelectorAll(`div.color-label__check`);
        [...colorPickerAll].forEach(color => {
            color.removeAttribute('style');
        });
        const newColorChosen =
            colorPickerContainer.querySelector(`div.color-label__check[data-id="${e.target.dataset.id}"]`);
        newColorChosen.style.display = 'block'
        const newItemId = e.target.dataset.id;
        changeFrameItem(this, currentItem, newItemId)
    }
}

