import { updateProductInfo } from './updateProductInfo.js';

/**
 * Switches images in the specified direction
 * @param {string} direction - Direction to navigate ('prev' or 'next')
 */
export function navigateImages(direction) {
    const mainImageContainer = document.querySelector('.detail-page__main-image');
    const images = Array.from(mainImageContainer.querySelectorAll('img'));

    // Find the currently visible image
    const currentImage = images.find(img => !img.classList.contains('item-hidden'));
    if (!currentImage) return;

    const currentIndex = images.indexOf(currentImage);
    let newIndex;

    if (direction === 'prev') {
        // Go to previous image (or last image if current is first)
        newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
        // Go to next image (or first image if current is last)
        newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }

    images[newIndex].classList.remove('item-hidden');
    setTimeout(() => {
        currentImage.classList.add('item-opaque');
        images[newIndex].classList.remove('item-opaque');
    }, 1);
    setTimeout(() => {
        currentImage.classList.add('item-hidden')
    }, 200);

    // Update product information
    updateProductInfo(images[newIndex]);
} 