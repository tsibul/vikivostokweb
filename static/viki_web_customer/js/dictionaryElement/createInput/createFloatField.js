'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create float input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createFloatField(fieldData) {
    const input = createModalInput('number');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    input.step = '0.01';
    return input;
}