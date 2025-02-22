'use strict'

import {createModalWindow} from "./createModalWindow.js";
import {modalDnD} from "../../modalFunction/modalDnD.js";

/**
 * open modal for editing element
 * @returns {Promise<void>}
 * @param e event 'click'
 */
export async function openEditModal(e) {
    e.preventDefault();
    const dictionaryContent = e.target.closest('.dictionary-content');
    const dictionaryHeader = dictionaryContent
        .parentElement.querySelector('.dictionary-frame__header');
    const dictionaryClass = dictionaryHeader.dataset.class;
    const dictionaryTitle = dictionaryHeader.dataset.title;
    const modal = await createModalWindow(dictionaryClass, dictionaryTitle, e.target.dataset.itemId);
    const service = document.querySelector('.service');
    service.appendChild(modal);
    modal.showModal();
    modalDnD(modal);
    console.log();
}