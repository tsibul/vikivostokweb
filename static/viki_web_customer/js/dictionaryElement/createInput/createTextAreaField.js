'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create text input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createTextAreaField(fieldData) {
    const input = createModalInput('textarea');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    return input;

}