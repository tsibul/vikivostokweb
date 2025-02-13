'use strict'

import {createModalHeader} from "./createModalHeader.js";
import {createButtonBlock} from "./createButtonBlock.js";
import {createModalContent} from "./createModalContent.js";

/**
 * create modal window foe add/edit class element
 * @param className class
 * @param title title for class
 * @param elementId from class
 * @returns {Promise<HTMLDialogElement>}
 */
export async function createModalWindow(className, title, elementId){
    const modalWindow = document.createElement("dialog");
    modalWindow.classList.add('modal');
    const modalHeader = createModalHeader(modalWindow, title, elementId);
    modalWindow.appendChild(modalHeader);
    const form = document.createElement('form');
    form.id = className + '__form';
    form.classList.add('modal__form');
    const modalContent = await createModalContent(modalWindow, className, elementId);
    form.appendChild(modalContent);
    form.appendChild(createButtonBlock(modalWindow));
    modalWindow.appendChild(form);
    return modalWindow;
}