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
    const newItem = colorLabel.closest('.product')
        .querySelector(`div.product-hor__image-frame[data-id="${newItemId}"]`);
    colorLabel.closest('.color-padding')
        .querySelector(`input[id="${colorLabel.htmlFor}"]`).checked = true;
    const img = newItem.querySelector('img');
    if(newItem !== currentItem) {
        if (img.complete) {
            newItem.classList.remove('item-hidden');
            setTimeout(() => {
                newItem.classList.remove('item-opaque')
            }, 1);
            currentItem.classList.add('item-opaque');
            setTimeout(() => {
                currentItem.classList.add('item-hidden')
            }, 400);
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
        const article = newItem.dataset.article;
        const price = newItem.dataset.price;
        const description = newItem.dataset.description;
        const frame = colorLabel.closest('.product');
        frame.querySelector('.product-hor__color-description').textContent = description;
        frame.querySelector('.price').textContent = price;
        frame.querySelector('.article').textContent = article;
    }
}