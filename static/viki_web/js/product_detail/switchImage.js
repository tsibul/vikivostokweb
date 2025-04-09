'use strict';

/**
 *
 * @param currentImage
 * @param newImage
 */
export function switchImage(currentImage, newImage) {
    newImage.classList.remove('item-hidden');
    setTimeout(() => {
        currentImage.classList.add('item-opaque');
        newImage.classList.remove('item-opaque');
    }, 1);
    setTimeout(() => {
        currentImage.classList.add('item-hidden')
    }, 200);
}