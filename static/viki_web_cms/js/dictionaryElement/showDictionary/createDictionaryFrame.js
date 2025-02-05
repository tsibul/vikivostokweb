'use strict';


import {deletedFilter} from "../deletedFilter.js";

export function createDictionaryFrame(dictionaryClass, dictionaryName) {
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
    const deletedCheck = document.createElement('input');
    deletedCheck.id = dictionaryClass + '-deleted';
    deletedCheck.type = 'checkbox';
    deletedCheck.checked = true;
    deletedCheck.classList.add('check');
    deletedCheck.addEventListener('change', (e) => deletedFilter(dictionaryClass, deletedCheck))
    headerRight.appendChild(deletedCheck);
    const checkLabel = document.createElement('label');
    checkLabel.htmlFor = dictionaryClass + '-deleted';
    checkLabel.classList.add('dictionary-frame__label');
    checkLabel.textContent = 'скрыть удаленные';
    headerRight.appendChild(checkLabel);
    const searchIcon = '<i class="fa fa-solid fa-magnifying-glass"></i>';
    headerRight.insertAdjacentHTML('beforeend', searchIcon);
    const searchInput = document.createElement('input');
    searchInput.classList.add('dictionary-frame__input');
    searchInput.type = 'text';
    searchInput.placeholder = 'поиск...';
    headerRight.appendChild(searchInput);
    const searchBtn = document.createElement('button');
    searchBtn.classList.add('btn', 'btn__save');
    searchBtn.textContent = 'Поиск';
    const clearBtn = document.createElement('button');
    clearBtn.classList.add('btn', 'btn__cancel');
    clearBtn.textContent = 'Очистить';
    headerRight.appendChild(searchBtn);
    headerRight.appendChild(clearBtn);
    frameHeader.appendChild(headerRight);
    outputFrame.appendChild(frameHeader);
    return outputFrame;
}