/**
 * @fileoverview Module for creating user rows in dictionary
 * @module userElement/createUserRows
 */

'use strict';

import {getUserExtensionData} from './getUserExtensionData.js';
import {loadMoreUsers} from './loadMoreUsers.js';
import {editUser} from './editUser.js';
import {createSaveButton} from "../createStandardElements/createSaveButton.js";

/**
 * Creates user rows for the dictionary display
 * @param {HTMLElement} container
 * @param {number} lastRecord - Last record number to start from
 * @param {string} searchString - Search string to filter users
 * @param {boolean} newOnly - Whether to show only new users
 * @returns {Promise<HTMLElement>} Container with user rows
 */
export async function createUserRows(container, lastRecord = 0, searchString = '', newOnly = false) {
    // Нормализация параметров
    if (searchString === null || searchString === undefined) {
        searchString = '';
    }

    const userData = await getUserExtensionData(lastRecord, searchString, newOnly);

    // Проверяем структуру полученных данных
    const userList = userData.userList || [];

    if (userList && userList.length > 0) {
        let counter = 1;
        userList.forEach(user => {
            const row = document.createElement('div');
            row.classList.add('dictionary-content__row', 'user-element__header');
            row.dataset.id = user.id;
            createUserRow(row, user);
            counter++;
            if (counter === 20) {
                row.dataset.last = (lastRecord + 20).toString();
                row.addEventListener('mouseover', () => {
                    loadMoreUsers(row, container, lastRecord + 20, searchString, newOnly);
                })
            }
            container.appendChild(row);
        });
    }
}


function createUserRow(row, user) {
    createTextField(row, user.last_name)
    createTextField(row, user.first_name)
    createTextField(row, user.email)
    createTextField(row, user.phone)
    createTextField(row, user.alias)
    row.appendChild(createNewCheckBox(user.new));
    createTextField(row, user.customer)

    const button = createSaveButton('Изм')
    button.dataset.id = user.id;
    button.addEventListener('click', async (e) => {
        await editUser(e);
    });
    row.appendChild(button);
}

function createTextField (row, text){
    const cell =  document.createElement('div');
    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
    cell.textContent = text || '';
    row.appendChild(cell);

}

export function createNewCheckBox(checked){
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.classList.add('check', 'user-element__check');
    newCheckbox.checked = checked || false;
    newCheckbox.disabled = true;
    return newCheckbox
}