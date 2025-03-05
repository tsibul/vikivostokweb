'use strict';


import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createDropDownListItem} from "../dropDown/createDropDown.js";

export async function createPriceDropdown() {
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
    const priceDataUrl = jsonUrl + 'dropdown_list/Price';
    const priceData = await fetchJsonData(priceDataUrl);
    if (priceData[0]) {
        dropDownInput.value = priceData[0].value;
        hiddenInput.value = priceData[0].id;
    }
    loadPriceDates(priceData, dropdownUl);
    dropdown.addEventListener('click', (e) => {
        dropdownUl.classList.remove('invisible');
    })
    document.addEventListener('click', (e) => {
        if (!dropDownFrame.contains(e.target)) {
            if (!dropdownUl.classList.contains('invisible')) {
                dropdownUl.classList.add('invisible')
            }
        }
    });
    return dropdown;
}


export function loadPriceDates(priceData, dropdownUl) {
    const headerLeft = document.querySelector('.dictionary-frame__header_left');
    dropdownUl.innerHTML = ''
    const dropDownInput = headerLeft.querySelector('.price-dropdown__input');
    const hiddenInput = headerLeft.querySelector('input[name="priceDateId"]');

    priceData.forEach((item) => {
        createDropDownListItem(item, dropdownUl, dropDownInput, hiddenInput);
    });
}

function closeDropdown(e) {

}