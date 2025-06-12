'use strict';

import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {getCSRFToken} from "../getCSRFToken.js";
import {closeModal} from "../modalFunction/closeModal.js";
import {chooseCompanyToAdd} from "./changeCompanyInGroup.js";


/**
 *
 * @param {HTMLElement} oldRow
 * @param {Object} customer
 */
export function createGroupRow(oldRow, customer) {
    const details = document.createElement('details');
    details.classList.add('group-element');
    const row = document.createElement('summary');
    [...oldRow.attributes].forEach(attr => {
        row.setAttribute(attr.name, attr.value);
    });
    oldRow.classList.remove(...oldRow.classList);
    oldRow.appendChild(details)
    details.appendChild(row);
    const companies = JSON.parse(customer.companySet);
    let tmpField;
    tmpField = createTextField(customer.name);
    row.appendChild(tmpField);
    tmpField = createTextField(customer.alias);
    row.appendChild(tmpField);
    tmpField = createTextField(customer.new ? 'да' : 'нет');
    row.appendChild(tmpField);
    tmpField = createTextField(customer.priceType);
    row.appendChild(tmpField);
    tmpField = createTextField(customer.managerName);
    row.appendChild(tmpField);
    tmpField = createTextField(companies.length);
    row.appendChild(tmpField);

    const button = createSaveButton('Добавить юр.лицо');
    button.dataset.id = customer.id;
    button.addEventListener('click', async () => {
        await chooseCompanyToAdd(customer.id)
    });
    row.appendChild(button);
    tmpField = document.createElement('div');
    tmpField.classList.add('order-element__toggle');
    row.appendChild(tmpField);
    companies.forEach(company => {
        createCompanyRow(company, details);
    })
}

/**
 *
 * @param {Object} item
 * @param {HTMLElement} details
 */
function createCompanyRow(item, details) {
    const itemRow = document.createElement('div')
    itemRow.classList.add('dictionary-content__row', 'group-element__item');
    itemRow.dataset.id = item.id;
    let tmpField;
    tmpField = createTextField('');
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.inn);
    itemRow.appendChild(tmpField);
    tmpField = createTextField('');
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.name);
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.vat ? 'с НДС' : 'без НДС');
    itemRow.appendChild(tmpField);

    const btnCancel = createCancelButton('Удалить');
    btnCancel.dataset.id = item.id;
    // btnCancel.addEventListener('click', async (e) => {
    //     await deleteFile(e);
    // });
    itemRow.appendChild(btnCancel);
    tmpField = createTextField('');
    itemRow.appendChild(tmpField);
    details.appendChild(itemRow);
}


/**
 *
 * @param {string} text
 * @returns {HTMLDivElement}
 */
function createTextField(text) {
    const cell = document.createElement('div');
    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
    cell.textContent = text || '';
    return cell;
}


/**
 *
 * @param {MouseEvent} e
 * @returns {Promise<void>}
 */
async function deleteFile(e) {
    const path = e.target.dataset.path;
    const row = e.target.closest('.files-element__item');
    const formData = new FormData;
    formData.append('file_path', path);
    const response = await fetch('/cms/json/delete_file', {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        body: formData
    });
    const data = await response.json()
    if (data.status === 'success') {
        const details = e.target.closest('details');
        row.remove();
        const contentRows = details.querySelectorAll('.files-element__item');
        if (![...contentRows].length) {
            details.remove();
        }
    }

}

/**
 *
 * @param {MouseEvent} e
 */
function showFile(e) {
    e.preventDefault();
    const url = '/' + e.target.dataset.path;
    window.open(url, '_blank');
}

async function deleteCategory(e) {
    const className = e.target.dataset.class;
    const formData = new FormData;
    formData.append('model_name', className);
    const response = await fetch('/cms/json/delete_unused_files', {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        body: formData
    });
    const data = await response.json()
    if (data.status === 'success') {
        const details = e.target.closest('details');
        details.remove();
    }
    const errors = data.errors;
    const deleted = data.deleted;
    const dialog = document.createElement('dialog');
    dialog.classList.add('files-element__message');
    document.body.appendChild(dialog)
    let tmpField;
    if (errors.length) {
        tmpField = createTextField('Ошибки');
        tmpField.classList.add('strong')
        dialog.appendChild(tmpField);
        errors.forEach(error => {
            const row = document.createElement('div');
            row.classList.add('files-element__row');
            dialog.appendChild(row);
            tmpField = createTextField(error.model);
            row.appendChild(tmpField);
            tmpField = createTextField(error.filename);
            row.appendChild(tmpField);
        });
    }
    if (deleted.length) {
        tmpField = createTextField('Удалено');
        tmpField.classList.add('files-element__strong')
        dialog.appendChild(tmpField);
        deleted.forEach(record => {
            const row = document.createElement('div');
            row.classList.add('files-element__row');
            dialog.appendChild(row);
            tmpField = createTextField(record.model);
            row.appendChild(tmpField);
            tmpField = createTextField(record.filename);
            row.appendChild(tmpField);
        });
    }
    const btnCancel = createCancelButton('Закрыть');
    btnCancel.addEventListener('click', () => {
        closeModal(dialog);
    });
    dialog.appendChild(btnCancel)
    dialog.showModal();

}



