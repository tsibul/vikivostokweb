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
    const currentItem = this.closest('.product-frame');
    if (labelCheck.style.display === '') {
        const newItemId = this.getAttribute('data-item-id');
        changeFrameItem(this, currentItem, newItemId)
        }
}

