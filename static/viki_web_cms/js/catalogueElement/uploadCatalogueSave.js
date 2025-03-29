'use strict'

import {searchStringNormalizer} from "../dictionaryElement/searchStringNormalizer.js";
import {jsonUrl} from "../main.js";
import {closeModal} from "../modalFunction/closeModal.js";
import {reloadCatalogue} from "./reloadCatalogue.js";
import {loadCsvAlert} from "./loadCsvAlert.js";
import {modalDnD} from "../modalFunction/modalDnD.js";
import {getCSRFToken} from "../getCSRFToken.js";

export async function csvUploadCatalogueSave(e) {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);
    const fileName = Object.fromEntries(formData.entries()).csv_file.name;
    const errorMessage = form.querySelector('.error-message')
    if (!fileName.endsWith('.csv')) {
        form.querySelector('input').value = '';
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Неправильный формат файла';
    } else {
        await uploadCatalogueSave(e, form, formData, 'catalogue_csv_load', errorMessage);
    }
}

export async function filesUploadCatalogueSave(e) {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);
    const errorMessage = form.querySelector('.error-message')
    await uploadCatalogueSave(e, form, formData, 'catalogue_files_load', errorMessage);
}

async function uploadCatalogueSave(e, form, formData, url, errorMessage) {
    const section = document.querySelector('.content')
    const searchString = section.querySelector('.dictionary-frame__input');
    const searchValue = searchStringNormalizer(searchString.value);
    const deletedCheck = section.querySelector('.check');
    const modal = e.target.closest('dialog');
    const saveUrl = jsonUrl + url;
    await fetch(saveUrl, {
        method: 'POST',
            headers: {
                "X-CSRFToken": getCSRFToken(),
            },
        body: formData,
    })
        .then(response => response.json())
        .then(postData => {
            if (postData.error) {
                form.querySelector('input').value = '';
                errorMessage.style.display = 'block';
                errorMessage.textContent = postData.error;
            } else {
                closeModal(modal);
                reloadCatalogue(section, deletedCheck.checked ? 1 : 0, searchValue);
                const alert = loadCsvAlert(postData);
                document.querySelector('.service').appendChild(alert);
                alert.showModal();
                modalDnD(alert);
            }
        });
}