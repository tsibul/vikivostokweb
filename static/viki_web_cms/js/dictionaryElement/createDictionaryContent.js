'use strict'

import {createStringField} from "./createField/createStringField.js";
import {createBooleanField} from "./createField/createBooleanField.js";
import {createNumberField} from "./createField/createNumberField.js";
import {createForeignField} from "./createField/createForeignField.js";
import {createImageField} from "./createField/createImageField.js";
import {createDictionaryTitle} from "./createDictionaryTitle.js";

const fieldCreation = {
    'string': createStringField,
    'boolean': createBooleanField,
    'number': createNumberField,
    'foreign': createForeignField,
    'image': createImageField,
};

export async function createDictionaryContent(elementClass) {
    const outputContent = document.createElement('div');
    outputContent.classList.add('dictionary-content');
    const dictionaryTitle = await createDictionaryTitle(elementClass);
    outputContent.appendChild(dictionaryTitle);
    return outputContent;
}