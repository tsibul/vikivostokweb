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


