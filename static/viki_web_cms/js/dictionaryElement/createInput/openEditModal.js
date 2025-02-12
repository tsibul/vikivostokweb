'use strict'

import {createModalWindow} from "./createModalWindow.js";
import {modalDnD} from "../../modalFunction/modalDnD.js";

/**
 * open modal for editing element
 * @param element
 * @returns {Promise<void>}
 */
export async function openEditModal(element) {
    const dictionaryContent = element.closest('.dictionary-content');
    const dictionaryHeader = dictionaryContent
        .parentElement.querySelector('.dictionary-frame__header');
    const dictionaryClass = dictionaryHeader.dataset.class;
    const dictionaryTitle = dictionaryHeader.dataset.title;
    const modal = await createModalWindow(dictionaryClass, dictionaryTitle, element.dataset.itemId);
    const service = document.querySelector('.service');
    service.appendChild(modal);
    modal.showModal();
    modalDnD(modal);
    console.log();
}