'use strict'

// import {createModalInput} from "./createModalInput.js";

/**
 * create text input
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export function createTextAreaField(fieldData) {
    const input = document.createElement('textarea');
    input.classList.add('modal__content_textarea');
    input.value = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    return input;

}