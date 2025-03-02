'use strict'

import {closeModal} from "../modalFunction/closeModal.js";
import {createModalHeader} from "../dictionaryElement/createInput/createModalHeader.js";
import {createButtonBlock} from "../dictionaryElement/createInput/createButtonBlock.js";
import {modalDnD} from "../modalFunction/modalDnD.js";
import {uploadCsvCatalogue} from "./uploadCsvCatalogue.js";

export function createCatalogueModal() {
    const service = document.querySelector('.service')
    const modalWindow = document.createElement("dialog");
    modalWindow.classList.add('catalogue__modal');
    modalWindow.addEventListener('keypress', (e) => {
        e.key === 'Escape' ? closeModal(modalWindow) : null;
    })
    const modalHeader = createModalHeader(modalWindow, '', 0);
    modalWindow.appendChild(modalHeader);
    const form = document.createElement('form');
    form.id = 'catalogueDialog';
    form.classList.add('modal__form');
    form.enctype = 'multipart/form-data';
    const inputFrame = document.createElement('div');
    inputFrame.classList.add('catalogue__input-frame');
    const fileInput = document.createElement('input');
    fileInput.classList.add('catalogue__modal_file-input');
    fileInput.type = 'file';
    fileInput.name = 'csv_file';
    fileInput.accept = '.csv';
    inputFrame.appendChild(fileInput);
    form.appendChild(inputFrame);
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Error';
    form.appendChild(errorMessage);
    form.appendChild(createButtonBlock(modalWindow, 0));
    modalWindow.appendChild(form);
    const buttonSubmit = form.querySelector('.submit');
    buttonSubmit.addEventListener('click', uploadCsvCatalogue);
    service.appendChild(modalWindow);
    modalHeader.firstElementChild.textContent = 'Загрузить csv файл'
    fileInput.addEventListener('change', () => {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    })
    modalWindow.showModal();
    modalDnD(modalWindow);
}