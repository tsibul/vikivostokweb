/**
 * @fileoverview Module for saving new price date
 * @module priceElement/priceDateSave
 */

'use strict'

import {loadPriceDates} from "./priceDropdownBody.js";
import {jsonUrl} from "../main.js";
import {closeModal} from "../modalFunction/closeModal.js";
import {getCSRFToken} from "../getCSRFToken.js";

/**
 * Saves new price date and updates the price list
 * @param {Event} e - Submit event from the price date form
 * @returns {Promise<void>}
 */
export async function priceDateSave(e) {
    e.preventDefault();
    const form = e.target.closest('form');
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
        const saveUrl = jsonUrl + 'save_new_price_date';
        await fetch(saveUrl, {
            method: 'POST',
            headers: {
                "X-CSRFToken": getCSRFToken(),
            },
            body: formData,
        })
            .then(res => res.json())
            .then(async priceDateData => {
                const headerLeft = document.querySelector('.dictionary-frame__header_left');
                const dropdownUl = headerLeft.querySelector('.dropdown__list');
                const dropDownInput = headerLeft.querySelector('.price-dropdown__input');
                const hiddenInput = headerLeft.querySelector('input[name="priceDateId"]');

                const modal = e.target.closest('dialog');
                await loadPriceDates(priceDateData, dropdownUl, dropDownInput, hiddenInput);

                closeModal(modal);
            });
    }
}