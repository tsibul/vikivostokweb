/**
 * @fileoverview Module for creating user element
 * @module userElement/createUserElement
 */

'use strict';

import {createUserDictionary} from "./createUserDictionary.js";
import {createUserRows} from "./createUserRows.js";
import {setupHeaderHandlers, updateContent} from "../fullScreenElement/headerHandlers.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createUserElement(className) {
    setupHeaderHandlers(createUserRows);
    const userDictionary = await createUserDictionary();
    userDictionary.id = className;
    return userDictionary;
}

// /**
//  * Настраивает обработчики событий для элементов заголовка
//  * @param {string} className - имя класса элемента
//  */
// function setupHeaderHandlers(className) {
//
//     const oldHeader = document.querySelector(`.dictionary-frame__header`);
//     const header = oldHeader.cloneNode(true);
//     oldHeader.parentNode.replaceChild(header, oldHeader);
//     const oldCheckbox = header.querySelector(`input[type="checkbox"]`);
//     const newCheckbox = oldCheckbox.cloneNode(true);
//     oldCheckbox.parentNode.replaceChild(newCheckbox, oldCheckbox)
//     const oldSearchInput = header.querySelector('.dictionary-frame__input');
//     const searchInput = oldSearchInput.cloneNode(true)
//     oldSearchInput.parentNode.replaceChild(searchInput, oldSearchInput)
//     const oldSearchBtn = header.querySelector('.btn__save');
//     const searchBtn = oldSearchBtn.cloneNode(true)
//     oldSearchBtn.parentNode.replaceChild(searchBtn, oldSearchBtn)
//     const oldClearBtn = header.querySelector('.btn__cancel');
//     const clearBtn = oldClearBtn.cloneNode(true)
//     oldClearBtn.parentNode.replaceChild(clearBtn, oldClearBtn)
//
//     newCheckbox.addEventListener('change', async () => {
//         const searchValue = searchInput.value;
//         await updateContent(searchValue, newCheckbox.checked, createUserRows);
//     });
//
//     searchBtn.addEventListener('click', async () => {
//         const searchValue = searchInput.value;
//         await updateContent(searchValue, newCheckbox.checked, createUserRows);
//     });
//
//     clearBtn.addEventListener('click', async () => {
//         searchInput.value = '';
//         await updateContent('', newCheckbox.checked, createUserRows);
//     });
//
//     searchInput.addEventListener('keypress', async (e) => {
//         if (e.key === 'Enter') {
//             const searchValue = searchInput.value;
//             await updateContent(searchValue, newCheckbox.checked, createUserRows);
//         }
//     });
// }

// async function updateContent(searchString, newOnly) {
//     let contentRows = document.querySelector('.dictionary-content__rows');
//     contentRows.innerHTML = '';
//     await createUserRows(contentRows, 0, searchString, newOnly)
// }
