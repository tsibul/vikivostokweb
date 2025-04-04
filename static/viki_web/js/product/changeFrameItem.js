/**
 * @fileoverview Module for changing product frame display
 * @module product/changeFrameItem
 */

'use strict'

/**
 * Changes the displayed product frame with animation
 * @param {HTMLElement} colorLabel - Color label element that was clicked
 * @param {HTMLElement} currentItem - Currently displayed product frame
 * @param {string} newItemId - ID of the new product frame to display
 */
export function changeFrameItem(colorLabel, currentItem, newItemId) {
    currentItem.querySelector(`#${colorLabel.htmlFor}`).checked = false;
    const newItem = colorLabel.closest('.product').querySelector(`div[data-id="${newItemId}"]`);
    const img = newItem.querySelector('img');
    if (img.complete) {
        newItem.classList.remove('item-hidden');
        setTimeout(() => {
            newItem.classList.remove('item-opaque')
        }, 1);
        currentItem.classList.add('item-opaque');
        setTimeout(() => {
            currentItem.classList.add('item-hidden')
        }, 600);
    } else {
        img.removeAttribute('loading');
        img.addEventListener('load', () => {
            newItem.classList.remove('item-hidden');
            setTimeout(() => {
                newItem.classList.remove('item-opaque')
            }, 1);
            currentItem.classList.add('item-opaque');
            setTimeout(() => {
                currentItem.classList.add('item-hidden')
            }, 400);
        });
    }
    const colorCode = colorLabel.dataset.hex;
    const newLabel = newItem.querySelector(`label[data-hex="${colorCode}"]`);
    newLabel.querySelector('.color-label__check').style.display = 'block';
    const newCheck = newItem.querySelector(`#${newLabel.htmlFor}`);
    newCheck.checked = true;
}