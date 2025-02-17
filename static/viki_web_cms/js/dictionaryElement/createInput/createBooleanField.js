'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create boolean field for modal as checkbox
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createBooleanField(fieldData) {
    const input = createModalInput('checkbox');
    input.checked = fieldData.fieldValue;
    input.id = fieldData.fieldName.field + 'Input';
    input.name = fieldData.fieldName.field;
    return input;
}