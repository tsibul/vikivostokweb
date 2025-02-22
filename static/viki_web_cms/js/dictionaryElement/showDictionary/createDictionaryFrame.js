'use strict';

import {createHeader} from "./createHeader.js";
import {getFieldStructure} from "../getFieldStructure.js";
import {gridDictionaryStyle} from "./gridDictonaryStyle.js";

/**
 * create frame for dictionary (right side)
 * @param dictionaryClass class selected
 * @param dictionaryName class name for header
 * @param fileUpload if upload needed
 * @returns {HTMLElement}
 */
export async function createDictionaryFrame(dictionaryClass, dictionaryName, fileUpload) {
    const outputFrame = document.createElement('section');
    outputFrame.classList.add('dictionary-frame');
    outputFrame.id = dictionaryClass;
    const frameHeader = createHeader(dictionaryClass, dictionaryName, fileUpload);
    outputFrame.appendChild(frameHeader);
    return outputFrame;
}