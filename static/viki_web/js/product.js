'use strict'

import {selectItemColor} from "./product/selectItemColor.js";
import {changeDetailTab} from "./product/changeDetailTab.js";

const colorInputs = document.querySelectorAll('.filter .product-header__filter-content_checkbox-hidden');
const productColorLabels  = document
    .querySelectorAll('.products label.color-label');
const detailTabButtons = document.querySelectorAll('.product-hor__tab-btn');


colorInputs.forEach(colorInput => {
    colorInput.addEventListener('change', (e) => {
        const label = document
            .querySelector(`label[for="${colorInput.id}"]`)
            .querySelector('.color-label__check');
        colorInput.checked ? label.style.display = 'block': label.style.display = 'none';
    });
});

productColorLabels.forEach(colorLabel => {
    colorLabel.addEventListener('click', selectItemColor);
});

detailTabButtons.forEach(tab => {
    tab.addEventListener('click', changeDetailTab);
})