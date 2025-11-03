'use strict';

/**
 *
 * @param currentImage
 * @param newImage
 */
export function switchImage(currentImage, newImage) {
    const currentId = currentImage.dataset.id;
    const newId = newImage.dataset.id;
    const thumbnails = currentImage.closest('.detail-page__gallery').querySelector('.detail-page__thumbnails');
    const allAdditionalPhotos = thumbnails.querySelectorAll('.detail-page__thumbnail');
    [...allAdditionalPhotos].forEach(photo => {
        if (photo.dataset.id === newId) {
            photo.classList.remove('item-hidden', 'item-opaque');
        } else if (photo.dataset.id === currentId) {
            photo.classList.add('item-hidden', 'item-opaque');
        }
    })
    newImage.classList.remove('item-hidden');
    // setTimeout(() => {
        currentImage.classList.add('item-opaque');
        newImage.classList.remove('item-opaque');
    // }, 1);
    // setTimeout(() => {
        currentImage.classList.add('item-hidden')
    // }, 100);
}