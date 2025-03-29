'use strict'

import {closeModal} from "../../modalFunction/closeModal.js";

/**
 * create header for modal window
 * @param modalWindow
 * @param title
 * @param elementId
 * @returns {HTMLDivElement}
 */
export function createModalHeader(modalWindow, title, elementId){
        const modalHeader = document.createElement("div");
    modalHeader.classList.add('modal__header')
    let headerText = title;
    elementId === '0' ? headerText = 'Создать ' + headerText: headerText = 'Изменить ' + headerText;
    const header = document.createElement("div");
    header.textContent = headerText;
    modalHeader.appendChild(header);
    const cross = document.createElement("button");
    cross.classList.add('modal__header_btn')
    cross.textContent = '×';
    cross.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(modalWindow);
    });
    modalHeader.appendChild(cross);
    return modalHeader
}