'use strict'

import {createCancelButton} from "../../createStandardElements/createCancelButton.js";
import {createSaveButton} from "../../createStandardElements/createSaveButton.js";
import {closeModal} from "../../modalFunction/closeModal.js";

/**
 * create button block for modal
 * @param modal
 * @returns {HTMLDivElement}
 */
export function createButtonBlock(modal) {
    const buttonBlock = document.createElement("div");
    buttonBlock.classList.add('modal__button-block');
    const cancelButton = createCancelButton('Отменить');
    cancelButton.type = 'button';
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(modal);
    });
    const saveButton = createSaveButton('Записать');
    saveButton.type = 'button';
    saveButton.classList.add('submit');
    buttonBlock.appendChild(cancelButton);
    buttonBlock.appendChild(saveButton);
    return buttonBlock;
}