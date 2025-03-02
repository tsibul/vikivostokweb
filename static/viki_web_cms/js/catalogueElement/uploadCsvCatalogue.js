'use strict'

import {jsonUrl} from "../main.js";
import {closeModal} from "../modalFunction/closeModal.js";
import {reloadCatalogue} from "./reloadCatalogue.js";
import {loadCsvAlert} from "./loadCsvAlert.js";
import {searchStringNormalizer} from "../dictionaryElement/searchStringNormalizer.js";
import {modalDnD} from "../modalFunction/modalDnD.js";

/**
 * check if extension is csv and send catalogue to backend
 * @param e
 * @returns {Promise<void>}
 */
export async function uploadCsvCatalogue(e) {
    e.preventDefault();
    const section = document.querySelector('.content')
    const searchString = section.querySelector('.dictionary-frame__input');
    const searchValue = searchStringNormalizer(searchString.value);
    const deletedCheck = section.querySelector('.check');

    const form = e.target.closest('form');
    const errorMessage = form.querySelector('.error-message')
    const modal = e.target.closest('dialog');
    const formData = new FormData(form);
    const fileName = Object.fromEntries(formData.entries()).csv_file.name;
    if (!fileName.endsWith('.csv')) {
        form.querySelector('input').value = '';
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Неправильный формат файла';
    } else {
        const saveUrl = jsonUrl + 'catalogue_csv_load';
        await fetch(saveUrl, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(rowData => {
                // const message = rowData.message;
                if (rowData.error) {
                    form.querySelector('input').value = '';
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = rowData.error;
                } else {
                    closeModal(modal);
                    reloadCatalogue(section, deletedCheck.checked ? 1 : 0, searchValue);
                    const alert = loadCsvAlert(rowData);
                    document.querySelector('.service').appendChild(alert);
                    alert.showModal();
                    modalDnD(alert);
                }
            });
    }
    console.log('mmm');
}