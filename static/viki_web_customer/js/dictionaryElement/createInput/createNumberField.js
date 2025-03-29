'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create number input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createNumberField(fieldData) {
    const input = createModalInput('number');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    return input;
}