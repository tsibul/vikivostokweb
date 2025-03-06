'use strict'

/**
 * create inputs for catalogue (all 'id' hidden)
 * @param itemType
 * @param itemName
 * @param itemValue
 * @returns {HTMLInputElement}
 */
export function createCatalogueItem(itemType, itemName, itemValue) {
    const item = document.createElement('input');
    if (ItemType !== 'float') {
        item.type = itemType
    } else { i
        item.type = 'number';
        item.step = '0.01';
    }
    item.name = itemName;
    if (itemName.slice(-2) === 'id') {
        item.hidden = true;
    }
    if (itemType === 'checkbox') {
        item.checked = itemValue;
        item.classList.add('check', 'catalogue__check');
    } else {
        item.value = itemValue;
        item.readOnly = true;
        item.classList.add('catalogue__input');
    }
    return item;
}