'use strict';

import {sendFormData} from "../common/sendFormData.js";

export async function dataSave(form, dataType) {
    const url = '/cabinet/save/' + dataType;
    const response = await sendFormData(url, form);
    if (response.status === 'ok') {
        window.location.reload();
    }
}