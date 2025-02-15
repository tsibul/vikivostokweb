'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create number input
 * @param fieldName
 * @param fieldValue
 * @param url
 * @returns {HTMLInputElement}
 */
export function createNumberField(fieldName, fieldValue, url) {
    const input = createModalInput('number');
    input.value = fieldValue;
    return input;
}