'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";
import {fetchJsonData} from "../common/fetchJsonData.js";

export async function dataInitial(personalData) {
    const data = await fetchJsonData('/cabinet_data/')
    let personalDataInitial;
    if (data.status === 'ok') {
        personalDataInitial = data.data['personalData'];
        fillInputsWithData(personalDataInitial, personalData);
    }
    return personalDataInitial;
}