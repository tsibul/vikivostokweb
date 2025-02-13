'use strict'

import {createFieldFrame} from "./createFieldFrame.js";
import {createModalInput} from "./createModalInput.js";

export function createImageField(fieldName, fieldValue, url) {
    const fieldFrame = createFieldFrame(fieldName);
    const input = createModalInput('image');
    input.src = url + fieldValue;
    input.alt = fieldName.field;
    fieldFrame.appendChild(input);
    return fieldFrame;

}