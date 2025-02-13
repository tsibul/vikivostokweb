'use strict'

import {createFieldFrame} from "./createFieldFrame.js";
import {createModalInput} from "./createModalInput.js";

export function createStringField(fieldName, fieldValue, url) {
    const fieldFrame = createFieldFrame(fieldName);
    const input = createModalInput('text');
    input.value = fieldValue;
    fieldFrame.appendChild(input);
    return fieldFrame;

}