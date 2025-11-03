/**
 * @fileoverview Module for creating input elements for catalogue items
 * @module catalogueElement/createCatalogueItem
 */

'use strict'

/**
 * Creates input elements for catalogue items with appropriate type and styling
 * @param {string} itemType - Type of input ('text', 'number', 'checkbox', 'precise', 'float')
 * @param {string} itemName - Name attribute for the input
 * @param {string|number|boolean} itemValue - Initial value for the input
 * @returns {HTMLInputElement} Configured input element
 */
export function createCatalogueItem(itemType, itemName, itemValue) {
    const item = document.createElement('input');
    if (itemType === 'precise') {
        item.type = 'number';
        item.step = '0.0001';
    } else if (itemType === 'float') {
        item.type = 'number';
        item.step = '0.01';
    } else {
        item.type = itemType
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