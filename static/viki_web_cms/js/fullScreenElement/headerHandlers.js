'use strict';

import {createRows} from "./createRows.js";

/**
 * Change header handlers for fullScreen element
 // * @param {function} getData
 * @param {function} createRow
 * @param {string} rowStyle
 * @param {string} fetchUrl
 */
export function setupHeaderHandlers(createRow, rowStyle, fetchUrl) {

    const oldHeader = document.querySelector(`.dictionary-frame__header`);
    const header = oldHeader.cloneNode(true);
    oldHeader.parentNode.replaceChild(header, oldHeader);
    const oldCheckbox = header.querySelector(`input[type="checkbox"]`);
    const newCheckbox = oldCheckbox.cloneNode(true);
    oldCheckbox.parentNode.replaceChild(newCheckbox, oldCheckbox)
    const oldSearchInput = header.querySelector('.dictionary-frame__input');
    const searchInput = oldSearchInput.cloneNode(true)
    oldSearchInput.parentNode.replaceChild(searchInput, oldSearchInput)
    const oldSearchBtn = header.querySelector('.btn__save');
    const searchBtn = oldSearchBtn.cloneNode(true)
    oldSearchBtn.parentNode.replaceChild(searchBtn, oldSearchBtn)
    const oldClearBtn = header.querySelector('.btn__cancel');
    const clearBtn = oldClearBtn.cloneNode(true)
    oldClearBtn.parentNode.replaceChild(clearBtn, oldClearBtn)

    newCheckbox.addEventListener('change', async () => {
        const searchValue = searchInput.value;
        await updateContent(searchValue, newCheckbox.checked, createRow, rowStyle, fetchUrl);
    });

    searchBtn.addEventListener('click', async () => {
        const searchValue = searchInput.value;
        await updateContent(searchValue, newCheckbox.checked, createRow, rowStyle, fetchUrl);
    });

    clearBtn.addEventListener('click', async () => {
        searchInput.value = '';
        await updateContent('', newCheckbox.checked, createRow, rowStyle, fetchUrl);
    });

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchValue = searchInput.value;
            await updateContent(searchValue, newCheckbox.checked, createRow, rowStyle, fetchUrl);
        }
    });
}

/**
 * Update fullScreen content (start with record 0)
 * @param {string} searchString
 * @param {boolean} newOnly
 * @param {function} createRow
 * @param {string} rowStyle
 * @param {string} fetchUrl
 * @returns {Promise<void>}
 */
export async function updateContent(searchString, newOnly, createRow, rowStyle, fetchUrl) {
    let contentRows = document.querySelector('.dictionary-content__rows');
    contentRows.innerHTML = '';
    await createRows (contentRows, 0, searchString, newOnly, createRow, rowStyle, fetchUrl)
}
