'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create input file field
 * @returns {HTMLDivElement}
 * @param fieldData
 */
export function createFileField(fieldData) {
    const fileFrame = document.createElement('div');
    fileFrame.classList.add('modal__content_file-frame');
    const input = createModalInput('file');
    input.placeholder = fieldData.fieldValue;
    input.name = fieldData.fieldName.field;
    fileFrame.appendChild(input);
    return fileFrame;

}