'use strict'

import {createDropDown} from "../dropDown/createDropDown.js";
import {reloadPriceList} from "./reloadPriceList.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {newPriceDate} from "./newPriceDate.js";

export async function createPriceElement(className){
    const dictionaryHeaderLeft = document.querySelector('.dictionary-frame__header_left');
    const priceDropdown = await createDropDown('Price', '', false);
    dictionaryHeaderLeft.appendChild(priceDropdown);
    const dropDownInput = priceDropdown.querySelector('input');
    const newPriceBtn = createSaveButton('Новый прайс');
    dictionaryHeaderLeft.appendChild(newPriceBtn);
    dropDownInput.addEventListener('change', reloadPriceList);
    newPriceBtn.addEventListener('click', newPriceDate);
    const priceElement = document.createElement('div');
    return priceElement;
}