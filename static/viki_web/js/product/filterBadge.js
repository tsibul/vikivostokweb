/**
 * @fileoverview Module for updating filter badge count
 * @module product/filterBadge
 */

'use strict'

/**
 * Updates the filter badge count based on selected filters and price range
 * @param {NodeList} filterChecks - List of filter checkbox elements
 * @param {HTMLInputElement} priceRange - Price range input element
 */
export function filterBadge(filterChecks, priceRange) {
    let filterCount = [...filterChecks].filter(item => item.checked).length;
    if (priceRange.value < priceRange.max - 0.1) {
        filterCount++;
    }
    const filterBadge = document.querySelector(`.filter-badge`);
    if (filterCount) {
        filterBadge.textContent = filterCount;
        filterBadge.style.display = 'block';
    } else {
        filterBadge.removeAttribute('style');
        filterBadge.textContent = '';
    }
}