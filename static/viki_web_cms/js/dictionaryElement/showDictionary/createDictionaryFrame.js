'use strict';

import {deletedFilter} from "../deletedFilter.js";
import {searchFilter} from "../searchFilter.js";
import {clearSearchFilter} from "../clearSearchFilter.js";
import {csvUpload} from "../../csvUpload/csvUpload.js";
import {createSaveButton} from "../../createStandardElements/createSaveButton.js";
import {createCancelButton} from "../../createStandardElements/createCancelButton.js";
import {createNeutralButton} from "../../createStandardElements/createNeutralButton.js";
import {searchIcon} from "../../createStandardElements/searchIcon.js";
import {createCheckbox} from "../../createStandardElements/createCheckbox.js";

export function createDictionaryFrame(dictionaryClass, dictionaryName, fileUpload) {
    const outputFrame = document.createElement('section');
    outputFrame.classList.add('dictionary-frame');
    outputFrame.id = dictionaryClass;
    const frameHeader = document.createElement('div');
    frameHeader.classList.add('dictionary-frame__header');
    const headerLeft = document.createElement('div');
    headerLeft.classList.add('dictionary-frame__header_left');
    headerLeft.textContent = dictionaryName;
    frameHeader.appendChild(headerLeft);
    const headerRight = document.createElement('div');
    headerRight.classList.add('dictionary-frame__header_right');
    if (fileUpload === 'true') {
        const uploadButton = createNeutralButton('Загрузить');
        uploadButton.addEventListener('click', () => csvUpload(dictionaryClass))
        headerRight.appendChild(uploadButton);
    }
    const deletedCheck = createCheckbox(true);
    deletedCheck.id = dictionaryClass + '-deleted';
    deletedCheck.addEventListener('change', () => deletedFilter(dictionaryClass, deletedCheck))
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
    headerRight.appendChild(searchInput);
    const searchBtn = createSaveButton('Поиск');
    searchBtn.addEventListener('click', (e) => searchFilter(e.target, dictionaryClass));
    const clearBtn = createCancelButton('Очистить');
    clearBtn.addEventListener('click', (e) => clearSearchFilter(e.target, dictionaryClass));
    headerRight.appendChild(searchBtn);
    headerRight.appendChild(clearBtn);
    frameHeader.appendChild(headerRight);
    outputFrame.appendChild(frameHeader);
    return outputFrame;
}