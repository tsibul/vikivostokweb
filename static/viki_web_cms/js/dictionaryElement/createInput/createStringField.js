'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create text input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createStringField(fieldData) {
    const input = createModalInput('text');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    return input;

}