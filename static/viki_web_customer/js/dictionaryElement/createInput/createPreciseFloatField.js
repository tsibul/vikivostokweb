'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create float input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createPreciseFloatField(fieldData) {
    const input = createModalInput('number');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    input.step = '0.0001';
    return input;
}