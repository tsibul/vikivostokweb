/**
 * @fileoverview Module for creating user rows in dictionary
 * @module userElement/createUserRows
 */

'use strict';

import {editUser} from './editUser.js';
import {createSaveButton} from "../createStandardElements/createSaveButton.js";

/**
 *
 * @param {HTMLElement} row
 * @param {Object} user
 */
export function createUserRow(row, user) {
    let tmpField;
    tmpField = createTextField(user.last_name);
    row.appendChild(tmpField);
    tmpField = createTextField(user.first_name);
    row.appendChild(tmpField);
    tmpField = createTextField(user.email);
    row.appendChild(tmpField);
    tmpField = createTextField(user.phone);
    row.appendChild(tmpField);
    tmpField = createTextField(user.alias);
    tmpField.classList.add('alias')
    row.appendChild(tmpField);
    row.appendChild(createNewCheckBox(user.new));
    tmpField = createTextField(user.customer);
    tmpField.classList.add('customer')
    row.appendChild(tmpField);

    const button = createSaveButton('Изм')
    button.dataset.id = user.id;
    button.addEventListener('click', async (e) => {
        await editUser(e, row);
    });
    row.appendChild(button);
}

function createTextField(text) {
    const cell = document.createElement('div');
    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
    cell.textContent = text || '';
    return cell;

}

export function createNewCheckBox(checked) {
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.classList.add('check', 'user-element__check');
    newCheckbox.checked = checked || false;
    newCheckbox.disabled = true;
    return newCheckbox
}