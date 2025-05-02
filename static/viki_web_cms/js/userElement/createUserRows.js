/**
 * @fileoverview Module for creating user rows in dictionary
 * @module userElement/createUserRows
 */

'use strict';

import {getUserExtensionData} from './getUserExtensionData.js';
import {loadMoreUsers} from './loadMoreUsers.js';

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
    const lastNameCell = document.createElement('div');
    lastNameCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-lastname');
    lastNameCell.textContent = user.last_name || '';
    row.appendChild(lastNameCell);

    const firstNameCell = document.createElement('div');
    firstNameCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-firstname');
    firstNameCell.textContent = user.first_name || '';
    row.appendChild(firstNameCell);

    const emailCell = document.createElement('div');
    emailCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-email');
    emailCell.textContent = user.email || '';
    row.appendChild(emailCell);

    const phoneCell = document.createElement('div');
    phoneCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-phone');
    phoneCell.textContent = user.phone || '';
    row.appendChild(phoneCell);

    const aliasCell = document.createElement('div');
    aliasCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-alias');
    aliasCell.textContent = user.alias || '';
    row.appendChild(aliasCell);

    const newCell = document.createElement('div');
    newCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-new');
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.classList.add('check');
    newCheckbox.checked = user.new || false;
    newCheckbox.disabled = true; // Только для отображения
    newCell.appendChild(newCheckbox);
    row.appendChild(newCell);

    const managerCell = document.createElement('div');
    managerCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-manager');
    managerCell.textContent = user.manager_letter || '';
    row.appendChild(managerCell);

    const customerCell = document.createElement('div');
    customerCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-customer');
    customerCell.textContent = user.customer || '';
    row.appendChild(customerCell);

    const buttonCell = document.createElement('div');
    buttonCell.classList.add('user-element__cell');
    const button = document.createElement('button');
    button.classList.add('btn', 'btn__save');
    button.textContent = 'Изм.';
    buttonCell.appendChild(button);
    row.appendChild(buttonCell);
}