'use strict'

import {createFieldFrame} from "./createFieldFrame.js";
import {createModalInput} from "./createModalInput.js";

/**
 * create input file field
 * @param fieldName
 * @param fieldValue
 * @returns {HTMLDivElement}
 */
export function createFileField(fieldName, fieldValue, url) {
    const fieldFrame = createFieldFrame(fieldName);
    const fileFrame = document.createElement('div');
    fileFrame.classList.add('modal__content_file-frame');
    const input = createModalInput('file');
    input.value = fieldValue;
    fileFrame.appendChild(input);
    fieldFrame.appendChild(fileFrame);
    return fieldFrame;

}