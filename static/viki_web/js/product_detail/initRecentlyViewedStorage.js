'use strict';

import {saveRecentlyViewed} from "./saveRecentlyViewed.js";


// recently viewed goods management in LocalStorage
export function initRecentlyViewedStorage() {
    // receive DOM data
    const contentElement = document.querySelector('.detail-page__content');
    if (!contentElement) return;

    const productId = contentElement.getAttribute('data-id');
    const productData = contentElement.getAttribute('data-data');

    if (!productId) return;

    // save viewed goods
    saveRecentlyViewed(productId, productData);
}



