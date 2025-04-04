/**
 * @fileoverview Module for handling edit button event listeners
 * @module cabinet/editBtnListeners
 */

'use strict';

import {startEdit} from "./startEdit.js";
import {cancelEdit} from "./cancelEdit.js";
import {dataSave} from "./dataSave.js";

/**
 * Sets up event listeners for edit, save and cancel buttons
 * @param {HTMLElement} data - Container element with form data
 * @param {Object} dataInitial - Initial data state
 * @param {string} focusId - ID of the input to focus on when editing starts
 * @param {string} formType - Type of the form being edited
 * @returns {Promise<void>}
 */
export async function editBtnListeners(data, dataInitial, focusId, formType) {
    const dataChangeBtn = data.querySelector('.btn__neutral');
    const dataSaveBtn = data.querySelector('.btn__save');
    const dataCancelBtn = data.querySelector('.btn__cancel');
    dataChangeBtn.addEventListener('click', (e) => {
        startEdit(data);
        data.querySelector(focusId).focus();
    });
    dataCancelBtn.addEventListener('click', (e) => {
        cancelEdit(dataInitial, data);
    });
    dataSaveBtn.addEventListener('click', async (e) => {
        await dataSave(data, formType);
    });
}