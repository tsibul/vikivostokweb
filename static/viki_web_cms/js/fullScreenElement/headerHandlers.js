'use strict';

/**
 * Change header handlers for fullScreen element
 * @param {function} createContent
 */
export function setupHeaderHandlers(createContent) {

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
        await updateContent(searchValue, newCheckbox.checked, createContent);
    });

    searchBtn.addEventListener('click', async () => {
        const searchValue = searchInput.value;
        await updateContent(searchValue, newCheckbox.checked, createContent);
    });

    clearBtn.addEventListener('click', async () => {
        searchInput.value = '';
        await updateContent('', newCheckbox.checked, createContent);
    });

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchValue = searchInput.value;
            await updateContent(searchValue, newCheckbox.checked, createContent);
        }
    });
}

/**
 * Update fullScreen content (start with record 0)
 * @param {string} searchString
 * @param {boolean} newOnly
 * @param {function} createContent
 * @returns {Promise<void>}
 */
export async function updateContent(searchString, newOnly, createContent) {
    let contentRows = document.querySelector('.dictionary-content__rows');
    contentRows.innerHTML = '';
    await createContent (contentRows, 0, searchString, newOnly)
}
