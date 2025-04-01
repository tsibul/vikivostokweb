'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";
import {fetchJsonData} from "../common/fetchJsonData.js";
import {createLegalData} from "./createLegalData.js";

export async function fullDataInitial(personalData, legalData) {
    const data = await fetchJsonData('/cabinet_data/')
    if (data.status === 'ok') {
        fillInputsWithData(data.data['personalData'], personalData);
        createLegalData(data.data['legalData'], legalData);
    }
    return data.data;
}