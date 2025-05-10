'use strict';

import {createSaveButton} from "../createStandardElements/createSaveButton";
import {editOrder} from "./editOrder.js";

/**
 *
 * @param {HTMLElement} row
 * @param {Object} order
 */
export function createOrderRow(row, order) {
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
    tmpField = createTextField(user.customer);
    tmpField.classList.add('customer')
    row.appendChild(tmpField);

    const button = createSaveButton('Изм')
    button.dataset.id = user.id;
    button.addEventListener('click', async (e) => {
        await editOrder(e, row);
    });
    row.appendChild(button);
}

function createTextField(text) {
    const cell = document.createElement('div');
    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
    cell.textContent = text || '';
    return cell;

}
