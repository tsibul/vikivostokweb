'use strict'

import {createModalInput} from "../dictionaryElement/createInput/createModalInput.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {jsonUrl} from "../main.js";

/**
 * create dropdown
 * @param className
 * @param itemValue
 * @returns {Promise<void>}
 */
export async function createDropDown(className, itemValue) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    const dropDownInput = createModalInput('text');
    dropDownInput.classList.add('dropdown__input');
    dropdown.appendChild(dropDownInput);
    dropdown.insertAdjacentHTML('beforeend',
        '<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');
    const dropdownUl = document.createElement('ul')
    dropdownUl.classList.add('dropdown__list', 'invisible');
    const url = jsonUrl + 'dropdown_list/' + className;
    const dropdownValues = await fetchJsonData(url);
    if (itemValue) {
        let itemElement = dropdownValues.find(e => e.id === itemValue)
        dropDownInput.value = itemElement.value;
    } else if (dropdownValues[0]) {
        dropDownInput.value = dropdownValues[0].value;
    }
    let dropDownListItem;
    dropdownValues.forEach(item => {
        dropDownListItem = document.createElement('li');
        dropDownListItem.classList.add('dropdown__list_item');
        dropDownListItem.value = item.id;
        dropDownListItem.textContent = item.value;
        dropDownListItem.addEventListener('click', (e) =>{
            dropDownInput.value = e.target.textContent;
            dropdownUl.classList.add('invisible');
        })
        dropdownUl.appendChild(dropDownListItem);
    });
    dropDownInput.addEventListener('click', () => {
        dropdownUl.classList.toggle('invisible')
    })
    dropdown.appendChild(dropdownUl);
    return dropdown;
}