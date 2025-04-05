/**
 * @fileoverview Module for handling price dropdown functionality
 * @module priceElement/priceDropdownBody
 */

'use strict';

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createDropDownListItem} from "../dropDown/createDropDown.js";


/**
 * Creates a price dropdown element by fetching price data
 * @returns {Promise<HTMLDivElement>} Price dropdown element
 */
export async function createPriceDropdown() {
    const priceDataUrl = jsonUrl + 'dropdown_list/Price';
    const priceData = await fetchJsonData(priceDataUrl);
    return priceDropdownBody(priceData);
}


/**
 * Loads price dates into the dropdown list
 * @param {Array<Object>} priceData - Array of price data objects
 * @param {HTMLUListElement} dropdownUl - Dropdown list element
 * @param {HTMLInputElement} dropDownInput - Dropdown input element
 * @param {HTMLInputElement} hiddenInput - Hidden input element for storing selected ID
 */
export function loadPriceDates(priceData, dropdownUl, dropDownInput, hiddenInput) {
    dropdownUl.innerHTML = ''
    priceData.forEach((item) => {
        createDropDownListItem(item, dropdownUl, dropDownInput, hiddenInput);
        dropDownInput.value = priceData[0].value;
        hiddenInput.value = priceData[0].id;
    });
}

/**
 * Creates the main price dropdown body element
 * @param {Array<Object>} priceData - Array of price data objects
 * @returns {HTMLDivElement} Complete price dropdown element
 */
export function priceDropdownBody(priceData) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('price-dropdown');
    const dropDownFrame = document.createElement('div');
    dropDownFrame.classList.add('price-dropdown__frame');
    const dropDownInput = document.createElement('input');
    dropDownInput.classList.add('price-dropdown__input');
    dropDownInput.readOnly = true;
    dropDownFrame.appendChild(dropDownInput);
    dropDownInput.insertAdjacentHTML('afterend',
        `<i class="fa-solid fa-chevron-down"></i>`);
    const hiddenInput = document.createElement('input');
    hiddenInput.hidden = true;
    hiddenInput.type = 'text';
    hiddenInput.name = 'priceDateId'
    dropdown.appendChild(dropDownFrame);
    dropdown.appendChild(hiddenInput);

    const dropdownUl = document.createElement('ul')
    dropdownUl.classList.add('dropdown__list', 'invisible');
    dropdown.appendChild(dropdownUl);
    if (priceData[0]) {
        dropDownInput.value = priceData[0].value;
        hiddenInput.value = priceData[0].id;
    }
    loadPriceDates(priceData, dropdownUl, dropDownInput, hiddenInput);
    dropdown.addEventListener('click', (e) => {
        dropdownUl.classList.remove('invisible');
    });
    document.addEventListener('click', (e) => {
        if (!dropDownFrame.contains(e.target)) {
            if (!dropdownUl.classList.contains('invisible')) {
                dropdownUl.classList.add('invisible')
            }
        }
    });
    return dropdown;
}
