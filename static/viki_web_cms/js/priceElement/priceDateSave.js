'use strict'

import {loadPriceDates} from "./priceDropdown.js";

export async function priceDateSave(e) {
    e.preventDefault();
    const form = e.target.closest('form');
    const modal = e.target.closest('dialog');
    const check = document.getElementById('promoCheck');
    const promoDate = document.getElementById('promoDate');
    promoDate.addEventListener('click', () => {
        promoDate.classList.remove('price__modal_border-alert');
    });
    check.addEventListener('click', () => {
        promoDate.classList.remove('price__modal_border-alert');
    });
    const priceDate = document.getElementById('priceDate');
    priceDate.addEventListener('click', () => {
        priceDate.classList.remove('price__modal_border-alert');
    });
    if (!priceDate.value) {
        priceDate.classList.add('price__modal_border-alert');
    } else if (check.checked && !promoDate.value) {
        promoDate.classList.add('price__modal_border-alert');
    } else {
        const formData = new FormData(form);


        // const headerLeft = document.querySelector('.dictionary-frame__header_left');
        // const dropdown = headerLeft.querySelector('.dropdown');
        // const newBtn = headerLeft.querySelector('button');
        // dropdown.remove();
        // const newDropDown = await createDropDown('Price', '', false)
        // newBtn.insertAdjacentElement('beforebegin', newDropDown);
        await loadPriceDates(priceDatesData);
    }
}