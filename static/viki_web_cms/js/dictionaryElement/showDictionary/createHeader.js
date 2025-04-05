'use strict'

import {createNeutralButton} from "../../createStandardElements/createNeutralButton.js";
import {csvUpload} from "../../csvUpload/csvUpload.js";
import {createCheckbox} from "../../createStandardElements/createCheckbox.js";
import {deletedFilter} from "../deletedFilter.js";
import {searchIcon} from "../../createStandardElements/searchIcon.js";
import {createSaveButton} from "../../createStandardElements/createSaveButton.js";
import {searchFilter} from "../searchFilter.js";
import {createCancelButton} from "../../createStandardElements/createCancelButton.js";
import {clearSearchFilter} from "../clearSearchFilter.js";
import {newFilter} from "../newFilter.js";

/**
 * Create Settings header for selected class
 * @param dictionaryClass selected class
 * @param dictionaryName class name for title
 * @param fileUpload if load file button needed
 * @param itemNew if new item checkbox needed
 * @returns {HTMLDivElement}
 */
export function createHeader(dictionaryClass, dictionaryName, fileUpload, itemNew) {
    const frameHeader = document.createElement('div');
    frameHeader.classList.add('dictionary-frame__header');
    const headerLeft = document.createElement('div');
    headerLeft.classList.add('dictionary-frame__header_left');
    headerLeft.textContent = dictionaryName;
    frameHeader.appendChild(headerLeft);
    const headerRight = document.createElement('div');
    headerRight.classList.add('dictionary-frame__header_right');
    if (fileUpload) {
        const uploadButton = createNeutralButton('Загрузить CSV');
        uploadButton.addEventListener('click', () => csvUpload(dictionaryClass))
        headerRight.appendChild(uploadButton);
    }
    if (itemNew) {
        const newCheck = createCheckbox(false);
        newCheck.id = dictionaryClass + '-new';
        newCheck.addEventListener('change', () => newFilter(dictionaryClass, newCheck))
        newCheck.classList.add('check-new');
        headerRight.appendChild(newCheck);
        const newLabel = document.createElement('label');
        newLabel.htmlFor = dictionaryClass + '-new';
        newLabel.classList.add('dictionary-frame__label');
        newLabel.textContent = 'только новые';
        headerRight.appendChild(newLabel);

    }
    const deletedCheck = createCheckbox(true);
    deletedCheck.id = dictionaryClass + '-deleted';
    deletedCheck.addEventListener('change', () => deletedFilter(dictionaryClass, deletedCheck))
    deletedCheck.classList.add('check-deleted');
    headerRight.appendChild(deletedCheck);
    const checkLabel = document.createElement('label');
    checkLabel.htmlFor = dictionaryClass + '-deleted';
    checkLabel.classList.add('dictionary-frame__label');
    checkLabel.textContent = 'скрыть удаленные';
    headerRight.appendChild(checkLabel);
    headerRight.insertAdjacentHTML('beforeend', searchIcon);
    const searchInput = document.createElement('input');
    searchInput.classList.add('dictionary-frame__input');
    searchInput.type = 'text';
    searchInput.placeholder = 'поиск...';
    searchInput.addEventListener('keypress', (e) => {
        e.key === 'Enter' ? searchFilter(e.target, dictionaryClass) : null;
    });
    headerRight.appendChild(searchInput);
    const searchBtn = createSaveButton('Поиск');
    searchBtn.addEventListener('click', (e) => searchFilter(e.target, dictionaryClass));
    const clearBtn = createCancelButton('Очистить');
    clearBtn.addEventListener('click', (e) => clearSearchFilter(e.target, dictionaryClass));
    headerRight.appendChild(searchBtn);
    headerRight.appendChild(clearBtn);
    frameHeader.appendChild(headerRight);
    frameHeader.dataset.class = dictionaryClass;
    frameHeader.dataset.title = dictionaryName;
    return frameHeader;
}