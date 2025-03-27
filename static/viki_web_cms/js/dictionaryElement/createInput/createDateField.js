'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create date input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createDateField(fieldData) {
    const input = createModalInput('date');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    return input;
}