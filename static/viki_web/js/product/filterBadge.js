'use strict'

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