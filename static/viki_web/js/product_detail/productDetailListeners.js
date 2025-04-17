/**
 * @fileoverview Main module for product detail page functionality
 * @module product_detail
 */

'use strict';

import { initImageNavigation } from './initImageNavigation.js';
import {initColorNavigation} from "./initColorNavigation.js";
import {initRecentlyViewedStorage} from "./initRecentlyViewedStorage.js";
import RecentlyViewed from '../recentGoods.js';

document.addEventListener('DOMContentLoaded', () => {
    initImageNavigation();
    initColorNavigation();
    
    // Initialize recently viewed section if it exists
    if (document.querySelector('.recently-viewed__items')) {
        RecentlyViewed.init();
    }
});

// Save recently viewed product when user leaves the page
window.addEventListener('beforeunload', () => {
    initRecentlyViewedStorage();
});