/**
 * @fileoverview Module for creating upload modal dialogs for catalogue
 * @module catalogueElement/uploadCatalogueModal
 */

'use strict'

import {closeModal} from "../modalFunction/closeModal.js";
import {createModalHeader} from "../dictionaryElement/createInput/createModalHeader.js";
import {createButtonBlock} from "../dictionaryElement/createInput/createButtonBlock.js";
import {modalDnD} from "../modalFunction/modalDnD.js";
import {createForeignField} from "../dictionaryElement/createInput/createForeignField.js";
import {csvUploadCatalogueSave, filesUploadCatalogueSave} from "./uploadCatalogueSave.js";

/**
 * Creates modal dialog for CSV file upload
 */
export function uploadCsvCatalogue() {
    const modalObject = uploadCatalogueModal('Загрузить csv файл');
    modalObject.fileInput.name = 'csv_file'
    modalObject.fileInput.accept = '.csv'
    modalObject.buttonSubmit.addEventListener('click', csvUploadCatalogueSave);
}

/**
 * Creates modal dialog for multiple photo upload with goods selection
 * @returns {Promise<void>}
 */
export async function uploadFilesCatalogue() {
    const modalObject = uploadCatalogueModal('Загрузить несколько фото');
    const goods = await createForeignField({
        'fieldName': {
            'field': 'goods',
            'foreignClass': 'Goods',
            'null': false,
        }
    });
    goods.style.marginTop = '8px';
    const buttonBlock = modalObject.form.querySelector('.modal__button-block');
    buttonBlock.insertAdjacentElement('beforebegin', goods);
    modalObject.fileInput.name = 'files';
    modalObject.fileInput.accept = 'image/png, image/jpeg, image/jpg';
    modalObject.fileInput.multiple = true;
    modalObject.buttonSubmit.addEventListener('click', filesUploadCatalogueSave);
}

/**
 * Creates and configures upload modal dialog
 * @param {string} text - Header text for the modal dialog
 * @returns {{form: HTMLFormElement, fileInput: HTMLInputElement, buttonSubmit: Element}} Modal dialog elements
 */
function uploadCatalogueModal(text) {
    const service = document.querySelector('.service')
    const modalWindow = document.createElement("dialog");
    modalWindow.classList.add('catalogue__modal');
    modalWindow.addEventListener('keypress', (e) => {
        e.key === 'Escape' ? closeModal(modalWindow) : null;
    })
    const modalHeader = createModalHeader(modalWindow, '', 0);
    modalHeader.firstElementChild.textContent = text;
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
    inputFrame.appendChild(fileInput);
    form.appendChild(inputFrame);
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Error';
    form.appendChild(errorMessage);
    form.appendChild(createButtonBlock(modalWindow, 0));
    modalWindow.appendChild(form);
    const buttonSubmit = form.querySelector('.submit');
    service.appendChild(modalWindow);
    fileInput.addEventListener('change', () => {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    })
    modalWindow.showModal();
    modalDnD(modalWindow);
    return {'form': form, 'fileInput': fileInput, 'buttonSubmit': buttonSubmit};
}

