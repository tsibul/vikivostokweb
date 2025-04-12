import { navigateImages } from './navigateImages.js';

/**
 * Initializes image navigation for product detail page
 */
export function initImageNavigation() {
    const mainImageContainer = document.querySelector('.detail-page__gallery');
    if (!mainImageContainer) return;

    const images = mainImageContainer.querySelectorAll('img');
    if (images.length <= 1) return; // No need to initialize navigation if there's only one image

    const prevButton = mainImageContainer.querySelector('.detail-page__nav-button--prev');
    const nextButton = mainImageContainer.querySelector('.detail-page__nav-button--next');

    // Add event listeners to buttons
    prevButton.addEventListener('click', () => navigateImages('prev'));
    nextButton.addEventListener('click', () => navigateImages('next'));
} 