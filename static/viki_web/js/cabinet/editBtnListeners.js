'use strict';

import {startEdit} from "./startEdit.js";
import {cancelEdit} from "./cancelEdit.js";
import {dataSave} from "./dataSave.js";

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