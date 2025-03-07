'use strict'

import {reloadPriceList} from "./reloadPriceList.js";
import {newPriceDate} from "./newPriceDate.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createPriceDropdown, priceDropdownBody} from "./priceDropdownBody.js";
import {createPriceContent} from "./createPriceContent.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";

export async function createPriceElement(className){
    const dictionaryHeaderLeft = document.querySelector('.dictionary-frame__header_left');
    const priceDropdown = await createPriceDropdown();
    dictionaryHeaderLeft.appendChild(priceDropdown);
    const dropDownInput = priceDropdown.querySelector('input');
    const newPriceBtn = createNeutralButton('Новый прайс');
    dictionaryHeaderLeft.appendChild(newPriceBtn);
    const downloadBtn = createCancelButton('Выгрузить прайс');
    dictionaryHeaderLeft.appendChild(downloadBtn);
    dropDownInput.addEventListener('change', reloadPriceList);
    newPriceBtn.addEventListener('click', newPriceDate);

    const dictionaryHeaderRight = document.querySelector('.dictionary-frame__header_right');
    dictionaryHeaderRight.firstElementChild.remove();
    dictionaryHeaderRight.firstElementChild.remove();
    const priceTypeLabel = document.createElement("label");
    priceTypeLabel.htmlFor = "priceType";
    priceTypeLabel.textContent = 'тип цены';
    const priceType = [
        {'id': 1, 'value': 'стандарт'},
        {'id': 2, 'value': 'от объема'},
        {'id': 3, 'value': 'нанесение'},
    ]
    const priceTypeDropdown = priceDropdownBody(priceType)
    priceTypeDropdown.id = "priceType";
    dictionaryHeaderRight.insertAdjacentElement('afterbegin', priceTypeDropdown);
    dictionaryHeaderRight.insertAdjacentElement('afterbegin',priceTypeLabel);
    const priceContent = document.createElement("div");
    const priceTypeId = priceTypeDropdown.querySelector('input[hidden]').value;
    const priceBlocks = await createPriceContent(dropDownInput.value, priceTypeId, 'None')
    priceContent.appendChild(priceBlocks.header);
    priceContent.appendChild(priceBlocks.form);
    return priceContent;
}


