import {colorNavigateImages} from "./colorNavigateImages.js";

/**
 * Initializes image navigation for product detail page
 */
export function initColorNavigation() {
    const mainImageContainer = document.querySelector('.detail-page__main-image');
    if (!mainImageContainer) return;

    const images = mainImageContainer.querySelectorAll('img');
    if (images.length <= 1) return; // No need to initialize navigation if there's only one image

    const standardColorRadio = document.querySelectorAll('.standard-color-radio');

    // Add event listeners to buttons
    [...standardColorRadio].forEach((item) => {
        item.addEventListener('change', colorNavigateImages);
        });
}