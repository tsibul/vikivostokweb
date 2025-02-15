'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create input file field
 * @param fieldName
 * @param fieldValue
 * @returns {HTMLDivElement}
 */
export function createFileField(fieldName, fieldValue, url) {
    const fileFrame = document.createElement('div');
    fileFrame.classList.add('modal__content_file-frame');
    const input = createModalInput('file');
    input.placeholder = fieldValue;
    fileFrame.appendChild(input);
    return fileFrame;

}