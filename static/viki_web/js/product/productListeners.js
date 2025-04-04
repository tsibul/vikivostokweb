/**
 * @fileoverview Module for initializing product-related event listeners
 * @module product/productListeners
 */

'use strict'

import {selectItemColor} from "./selectItemColor.js";
import {changeDetailTab} from "./changeDetailTab.js";
import {selectNext} from "./selectNext.js";
import {moveRange} from "./moveRange.js";
import {clearFilter} from "./clearFilter.js";
import {applyFilter} from "./applyFilter.js";
import {filterBadge} from "./filterBadge.js";
import {openSimpleConstructor} from "../constructor/openSimpleConstructor.js";

/**
 * Initializes all product-related event listeners
 * @returns {Promise<void>}
 */
export async function productListeners() {

    const colorInputs = document.querySelectorAll('.filter .product-header__filter-content_checkbox-hidden');
    const productColorLabels = document
        .querySelectorAll('.products label.color-label');
    const detailTabButtons = document.querySelectorAll('.tab-btn');
    const chevronNext = document.querySelectorAll('.chev-next');
    const priceRange = document.querySelector('.filter .input-range');
    const filterSubmit = document.querySelector('.filter .btn__save');
    const filterCancel = document.querySelector('.filter .btn__cancel');
    const filterChecks = document.querySelectorAll(`.filter input[type='checkbox']`);
    const btnMulticolor = document.querySelectorAll('.btn-multicolor');

    colorInputs.forEach(colorInput => {
        colorInput.addEventListener('change', (e) => {
            const label = document
                .querySelector(`label[for="${colorInput.id}"]`)
                .querySelector('.color-label__check');
            colorInput.checked ? label.style.display = 'block' : label.removeAttribute('style');
        });
    });

    productColorLabels.forEach(colorLabel => {
        colorLabel.addEventListener('click', selectItemColor);
    });

    detailTabButtons.forEach(tab => {
        tab.addEventListener('click', changeDetailTab);
    })

    chevronNext.forEach(chev => {
        chev.addEventListener('click', selectNext);
    });

    priceRange.addEventListener('input', moveRange);
    priceRange.addEventListener('input', e => {
        filterBadge(filterChecks, priceRange);
    });

    filterCancel.addEventListener('click', clearFilter);

    filterSubmit.addEventListener('click', await applyFilter);

    filterChecks.forEach(check => {
        check.addEventListener('change', e => {
        filterBadge(filterChecks, priceRange);
    });});

    btnMulticolor.forEach(btn => {
        btn.addEventListener('click', openSimpleConstructor);
    });
}