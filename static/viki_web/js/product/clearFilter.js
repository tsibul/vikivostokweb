/**
 * @fileoverview Module for clearing product filters
 * @module product/clearFilter
 */

'use strict'

/**
 * Clears all product filters and resets the product display
 * @param {Event} e - Click event on the clear filter button
 */
export function clearFilter(e) {
    const inputs = document
        .querySelectorAll(`.filter input[type="checkbox"]`);
    const colorSelects = document
        .querySelectorAll(`.filter__content_data_color .color-label__check`);
    const filterDetails = document.querySelector(`.filter`);
    const priceRange = document.querySelector(`.filter .input-range`);
    const priceRangeValue = document.querySelector(`.filter .input-range__value`);
    inputs.forEach(input => {
        input.checked = false
    });
    colorSelects.forEach(select => {
        select.removeAttribute('style')
    });
    priceRange.value = priceRange.max;
    priceRangeValue.textContent = 'до ' + priceRange.max;
    filterDetails.removeAttribute('open')
    const allGoods = document.querySelectorAll('.product');
    [...allGoods].forEach(goods => {
        goods.removeAttribute('style')
        const insideItems = goods.querySelectorAll('.product-hor__image-frame');
        const rndId = Math.round(Math.random() * (insideItems.length - 1));
        goods.querySelector(`.chev-next`).dataset.list =
            goods.querySelector(`.chev-next`).dataset.listInitial;
        [...insideItems].forEach((item, index) => {
            item.removeAttribute('style');
            // item.querySelector(`.chev-next`).dataset.list =
            //     item.querySelector(`.chev-next`).dataset.listInitial;
            if (insideItems.length > 1) {
                if (index === rndId) {
                    item.classList.remove('item-hidden', 'item-opaque');
                } else {
                    item.classList.add('item-hidden', 'item-opaque');
                }
            } else {
                item.classList.remove('item-hidden', 'item-opaque');
            }
        });
    });

    const allColors = document.querySelectorAll(`.products .color-label`);
    [...allColors].forEach(item => {
        item.removeAttribute('style')
    });

    const filterBadge = document.querySelector(`.filter-badge`);
    filterBadge.removeAttribute('style');
    filterBadge.textContent = '';
}