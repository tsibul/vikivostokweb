'use strict';

import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createRows} from "../fullScreenElement/createRows.js";
import {getCSRFToken} from "../getCSRFToken.js";


/**
 *
 * @param {HTMLElement} oldRow
 * @param {Object} className
 */
export function createFileRow(oldRow, className) {
    const details = document.createElement('details');
    details.classList.add('files-element');
    const row = document.createElement('summary');
    [...oldRow.attributes].forEach(attr => {
        row.setAttribute(attr.name, attr.value);
    });
    oldRow.classList.remove(...oldRow.classList);
    oldRow.appendChild(details)
    details.appendChild(row);
    let tmpField;
    tmpField = createTextField(className.name);
    row.appendChild(tmpField);
    tmpField = createTextField('');
    row.appendChild(tmpField);
    tmpField = createTextField('');
    row.appendChild(tmpField);
    tmpField = createTextField('');
    row.appendChild(tmpField);

    const button = createCancelButton('Удалить все файлы');
    button.dataset.class = className.name;
    row.appendChild(button);
    tmpField = document.createElement('div');
    tmpField.classList.add('order-element__toggle');
    row.appendChild(tmpField);
    className.files.forEach(file => {
        createSingleFileRow(file, details);
    })
}

/**
 *
 * @param item
 * @param details
 */
function createSingleFileRow(item, details) {
    const itemRow = document.createElement('div')
    itemRow.classList.add('dictionary-content__row', 'files-element__item');
    itemRow.dataset.path = item.path;
    let tmpField;
    tmpField = createTextField('');
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.filename);
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.path);
    itemRow.appendChild(tmpField);

    const btnSave = createSaveButton('Скачать');
    btnSave.dataset.path = item.path;
    // button.addEventListener('click', async (e) => {
    //     await editItem(e, itemRow, orderRow);
    // });
    itemRow.appendChild(btnSave);
    const btnCancel = createCancelButton('Удалить');
    btnCancel.dataset.path = item.path;
    // button.addEventListener('click', async (e) => {
    //     await editItem(e, itemRow, orderRow);
    // });
    itemRow.appendChild(btnCancel);
    details.appendChild(itemRow);
}


function createTextField(text) {
    const cell = document.createElement('div');
    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
    cell.textContent = text || '';
    return cell;
}



