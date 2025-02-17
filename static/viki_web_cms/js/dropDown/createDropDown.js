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
    const hiddenInput = document.createElement('input');
    hiddenInput.hidden = true;
    hiddenInput.type = 'text';
    dropDownInput.classList.add('dropdown__input');
    dropdown.appendChild(dropDownInput);
    dropdown.appendChild(hiddenInput);
    dropdown.insertAdjacentHTML('beforeend',
        '<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');
    const dropdownUl = document.createElement('ul')
    dropdownUl.classList.add('dropdown__list', 'invisible');
    const url = jsonUrl + 'dropdown_list/' + className;
    const dropdownValues = await fetchJsonData(url);
    if (itemValue) {
        let itemElement = dropdownValues.find(e => e.id === itemValue)
        dropDownInput.value = itemElement.value;
        hiddenInput.value = itemElement.id
    } else if (dropdownValues[0]) {
        dropDownInput.value = dropdownValues[0].value;
        hiddenInput.value = dropdownValues[0].id;
    }
    createForeignList(dropdownValues, dropdownUl, dropDownInput, hiddenInput);
    dropDownInput.addEventListener('click', () => {
        dropdownUl.classList.toggle('invisible')
    });
    dropdown.appendChild(dropdownUl);
    dropDownInput.addEventListener('keyup', (e) => {
        let filter = e.target.value.toUpperCase();
        const filterValues = dropdownValues.filter(element =>
            element.value.toUpperCase().indexOf(filter) > -1);
        dropdownUl.innerHTML = '';
        createForeignList(filterValues, dropdownUl, dropDownInput, hiddenInput);
    });
    return dropdown;
}

/**
 * create list of foreign values
 * @param dropdownValues
 * @param dropdownUl
 * @param dropDownInput
 * @param hiddenInput
 */
function createForeignList(dropdownValues, dropdownUl, dropDownInput, hiddenInput) {
    let dropDownListItem;
    dropdownValues.forEach(item => {
        dropDownListItem = document.createElement('li');
        dropDownListItem.classList.add('dropdown__list_item');
        dropDownListItem.value = item.id;
        dropDownListItem.textContent = item.value;
        dropDownListItem.addEventListener('click', (e) => {
            dropDownInput.value = e.target.textContent;
            hiddenInput.value = e.target.value;
            dropdownUl.classList.add('invisible');
        })
        dropdownUl.appendChild(dropDownListItem);
    });

}