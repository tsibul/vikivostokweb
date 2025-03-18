'use strict'

import {changeFrameItem} from "./changeFrameItem.js";

export function selectItemColor(e) {
    const labelCheck = this.querySelector('.color-label__check');
    const currentItem = this.closest('.product-hor__frame');
    if (labelCheck.style.display === '') {
        const newItemId = this.getAttribute('data-item-id');
        changeFrameItem(this, currentItem, newItemId)
        }
}

