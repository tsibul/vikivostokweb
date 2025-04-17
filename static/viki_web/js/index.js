/**
 * @fileoverview Main entry point for the application
 * @module index
 */

'use strict'

import RecentlyViewed from "./recentGoods.js";


document.addEventListener("DOMContentLoaded", () => {

    // Initialize recently viewed section if it exists
    if (document.querySelector('.recently-viewed__items')) {
        RecentlyViewed.init();
    }
});