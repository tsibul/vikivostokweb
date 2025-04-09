import {updateProductInfo} from './updateProductInfo.js';
import {switchImage} from "./switchImage.js";

/**
 * Switches images in the specified direction
 */
export function colorNavigateImages(e) {
    // const forLabel = document.querySelector(`label[for="${e.target.id}"]`);
    // forLabel.querySelector('.color-label__check').removeAttribute('style');
    const mainImageContainer = document.querySelector('.detail-page__main-image');
    const images = Array.from(mainImageContainer.querySelectorAll('img'));

    // Find the currently visible image
    const currentImage = images.find(img => !img.classList.contains('item-hidden'));
    if (!currentImage) return;

    const newImage = images.find(img => img.dataset.id === e.target.value);

    switchImage(currentImage, newImage);

    // Update product information
    updateProductInfo(newImage);
} 