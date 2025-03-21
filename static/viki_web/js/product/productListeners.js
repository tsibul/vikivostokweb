'use strict'

import {selectItemColor} from "./selectItemColor.js";
import {changeDetailTab} from "./changeDetailTab.js";
import {selectNext} from "./selectNext.js";
import {moveRange} from "./moveRange.js";
import {clearFilter} from "./clearFilter.js";
import {applyFilter} from "./applyFilter.js";

export async function productListeners() {

    const colorInputs = document.querySelectorAll('.filter .product-header__filter-content_checkbox-hidden');
    const productColorLabels = document
        .querySelectorAll('.products label.color-label');
    const detailTabButtons = document.querySelectorAll('.product-hor__tab-btn');
    const chevronNext = document.querySelectorAll('.chevron-next');
    const priceRange = document.querySelector('.filter .input-range');
    const filterSubmit = document.querySelector('.filter .btn__save');
    const filterCancel = document.querySelector('.filter .btn__cancel');

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

    filterCancel.addEventListener('click', clearFilter);

    filterSubmit.addEventListener('click', await applyFilter);
}