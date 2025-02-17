'use strict'

import {createModalHeader} from "./createModalHeader.js";
import {createButtonBlock} from "./createButtonBlock.js";
import {createModalContent} from "./createModalContent.js";
import {jsonUrl} from "../../main.js";
import {closeModal} from "../../modalFunction/closeModal.js";

/**
 * create modal window foe add/edit class element
 * @param className class
 * @param title title for class
 * @param elementId from class
 * @returns {Promise<HTMLDialogElement>}
 */
export async function createModalWindow(className, title, elementId) {
    const modalWindow = document.createElement("dialog");
    modalWindow.classList.add('modal');
    const modalHeader = createModalHeader(modalWindow, title, elementId);
    modalWindow.appendChild(modalHeader);
    const form = document.createElement('form');
    form.id = className + '__form';
    form.classList.add('modal__form');
    form.enctype = 'multipart/form-data';
    // form.method = 'post';
    const elemId = document.createElement('input');
    elemId.value = elementId;
    elemId.hidden = true;
    elemId.name = 'id';
    const modalContent = await createModalContent(modalWindow, className, elementId);
    form.appendChild(elemId);
    form.appendChild(modalContent);
    form.appendChild(createButtonBlock(modalWindow));
    modalWindow.appendChild(form);
    const initialData = new FormData(form)
    const buttonSubmit = form.querySelector('.submit');
    buttonSubmit.addEventListener('mousedown', (e) => sendForm(e, form, className, initialData))
    return modalWindow;
}

/**
 *
 * @param event
 * @param form
 * @param className
 * @param initialData
 */
async function sendForm(event, form, className, initialData) {
    event.preventDefault();
    const modal = form.closest('.modal')
    event.target.disabled = true;
    const formData = new FormData(form);
    if (!checkChangeForm(formData, initialData)) {
        const fetchPath = jsonUrl + 'edit_dictionary/' + className;
        await fetch(fetchPath, {
            method: 'POST',
            body: formData,
        });
    }
    closeModal(modal);
    console.log();
}

/**
 *
 * @param formData
 * @param initialData
 * @returns {boolean}
 */
function checkChangeForm(formData, initialData) {
    const valuesInitial = Array.from(initialData.values());
    const valuesCurrent = Array.from(formData.values());
    valuesInitial.sort();
    valuesCurrent.sort();
    return JSON.stringify(valuesInitial) === JSON.stringify(valuesCurrent);
}
