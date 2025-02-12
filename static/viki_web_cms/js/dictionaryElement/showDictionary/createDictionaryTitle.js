'use strict'

import {createHEXSquare} from "./createHEXSquare.js";
import {openEditModal} from "../createInput/openEditModal.js";

/**
 * create dictionary title
 * @param titleObject field names & params object
 * @returns {Promise<HTMLDivElement>}
 */
export async function createDictionaryTitle(titleObject) {
    const dictionaryTitle = document.createElement('div');
    dictionaryTitle.classList.add('dictionary-content__title', 'dictionary-content__row');
    dictionaryTitle.appendChild(createHEXSquare());
    titleObject.forEach(title => {
        let titleItem = document.createElement("div");
        titleItem.classList.add('dictionary-content__title_item');
        titleItem.textContent = title['label'];
        dictionaryTitle.appendChild(titleItem);
    });
    const newBtn = document.createElement("button");
    newBtn.classList.add('btn', 'btn__save');
    newBtn.textContent = 'Создать';
    newBtn.dataset.itemId = '0';
    newBtn.addEventListener('click', (e) => openEditModal(e.target))
    dictionaryTitle.appendChild(newBtn);
    return dictionaryTitle;
}

