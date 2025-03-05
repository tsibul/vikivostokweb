'use strict'

import {reloadPriceList} from "./reloadPriceList.js";
import {newPriceDate} from "./newPriceDate.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createPriceDropdown} from "./priceDropdown.js";

export async function createPriceElement(className){
    const dictionaryHeaderLeft = document.querySelector('.dictionary-frame__header_left');
    const priceDropdown = await createPriceDropdown();
    dictionaryHeaderLeft.appendChild(priceDropdown);
    const dropDownInput = priceDropdown.querySelector('input');
    const newPriceBtn = createNeutralButton('Новый прайс');
    dictionaryHeaderLeft.appendChild(newPriceBtn);
    dropDownInput.addEventListener('change', reloadPriceList);
    newPriceBtn.addEventListener('click', newPriceDate);
    const priceElement = document.createElement('div');
    return priceElement;
}