'use strict'

import {reloadPriceList} from "./reloadPriceList.js";
import {newPriceDate} from "./newPriceDate.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {createPriceDropdown, priceDropdownBody} from "./priceDropdownBody.js";
import {createPriceContent} from "./createPriceContent.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";

/**
 * create total price how you see it
 * @param className
 * @returns {Promise<HTMLDivElement>}
 */
export async function createPriceElement(className) {
    const dictionaryHeaderLeft = document.querySelector('.dictionary-frame__header_left');
    const priceDropdown = await createPriceDropdown();
    dictionaryHeaderLeft.appendChild(priceDropdown);
    const dropDownInput = priceDropdown.querySelector('input');
    const hiddenPriceInput = priceDropdown.querySelector('input[hidden]');
    const newPriceBtn = createNeutralButton('Новый прайс');
    dictionaryHeaderLeft.appendChild(newPriceBtn);
    const downloadBtn = createCancelButton('Выгрузить прайс');
    dictionaryHeaderLeft.appendChild(downloadBtn);
    hiddenPriceInput.addEventListener('change', await reloadPriceList);
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
    priceTypeDropdown.addEventListener('change', await reloadPriceList);
    dictionaryHeaderRight.insertAdjacentElement('afterbegin', priceTypeDropdown);
    dictionaryHeaderRight.insertAdjacentElement('afterbegin', priceTypeLabel);
    const priceContent = document.createElement("div");
    priceContent.classList.add('price-block');
    const priceTypeId = priceTypeDropdown.querySelector('input[hidden]').value;
    const priceBlocks = await createPriceContent(dropDownInput.value, priceTypeId, 'None')
    priceContent.appendChild(priceBlocks.header);
    priceContent.appendChild(priceBlocks.form);

    const searchInputOld = dictionaryHeaderRight.querySelector('.dictionary-frame__input');
    searchInputOld.remove();
    const searchBtnOld = dictionaryHeaderRight.querySelector('.btn__save');
    searchBtnOld.remove()
    const cancelSearchBtnOld = dictionaryHeaderRight.querySelector('.btn__cancel');
    cancelSearchBtnOld.remove();
    const searchInput = document.createElement('input');
    searchInput.classList.add('dictionary-frame__input');
    searchInput.type = 'text';
    searchInput.placeholder = 'поиск...';
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && e.target.value) reloadPriceList();
    })
    dictionaryHeaderRight.appendChild(searchInput);
    const searchBtn = createSaveButton('Поиск');
    searchBtn.addEventListener('click', reloadPriceList);
    dictionaryHeaderRight.appendChild(searchBtn);
    const clearBtn = createCancelButton('Очистить');
    clearBtn.addEventListener('click', e => {
        searchInput.value = '';
        reloadPriceList();
    })
    dictionaryHeaderRight.appendChild(clearBtn);
    return priceContent;
}


