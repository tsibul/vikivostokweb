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
    
    // // Initialize about dropdown menu hover effect for better mobile experience
    // const aboutMenu = document.querySelector('.about-menu');
    // if (aboutMenu) {
    //     aboutMenu.addEventListener('click', function(e) {
    //         // Only handle the click if it's directly on the "О компании" text
    //         if (e.target.textContent === 'О компании' && e.target.parentElement === this) {
    //             e.preventDefault();
    //             const dropdown = this.querySelector('.about-menu__dropdown');
    //             if (dropdown) {
    //                 dropdown.classList.toggle('force-display');
    //             }
    //         }
    //     });
    //
    //     // Hide dropdown when clicking outside of it
    //     document.addEventListener('click', function(e) {
    //         if (!aboutMenu.contains(e.target)) {
    //             const dropdown = aboutMenu.querySelector('.about-menu__dropdown');
    //             if (dropdown) {
    //                 dropdown.classList.remove('force-display');
    //             }
    //         }
    //     });
    // }
});

// Save recently viewed product when user leaves the page
window.addEventListener('beforeunload', () => {
    initRecentlyViewedStorage();
});