'use strict'

import {createFieldFrame} from "./createFieldFrame.js";
import {createModalInput} from "./createModalInput.js";

export function createNumberField(fieldName, fieldValue, url) {
    const fieldFrame = createFieldFrame(fieldName);
    const input = createModalInput('number');
    input.value = fieldValue;
    fieldFrame.appendChild(input);
    return fieldFrame;

}