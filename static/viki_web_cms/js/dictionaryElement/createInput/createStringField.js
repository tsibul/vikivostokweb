'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create text input
 * @param fieldName
 * @param fieldValue
 * @param url
 * @returns {HTMLInputElement}
 */
export function createStringField(fieldName, fieldValue, url) {
    const input = createModalInput('text');
    input.value = fieldValue;
    return input;

}