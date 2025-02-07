'use strict'


import {createDictionaryTitle} from "./createDictionaryTitle.js";
import {gridDictionaryStyle} from "./gridDictonaryStyle.js";
import {createStringField} from "../createInput/createStringField.js";
import {createBooleanField} from "../createInput/createBooleanField.js";
import {createNumberField} from "../createInput/createNumberField.js";
import {createForeignField} from "../createInput/createForeignField.js";
import {createImageField} from "../createInput/createImageField.js";
import {jsonUrl} from "../../main.js";
import {fetchJsonData} from "../../fetchJsonData.js";
import {createDictionaryRows} from "./createDictionaryRows.js";

const fieldCreation = {
    'string': createStringField,
    'boolean': createBooleanField,
    'number': createNumberField,
    'foreign': createForeignField,
    'image': createImageField,
};

export async function createDictionaryContent(elementClass, deleted, searchString) {
    const url = jsonUrl + 'field_names/' + elementClass;
    const titleObject = await fetchJsonData(url);
    const rowGrid = gridDictionaryStyle(titleObject);
    const outputContent = document.createElement('div');
    outputContent.classList.add('dictionary-content');
    const dictionaryTitle = await createDictionaryTitle(titleObject);
    dictionaryTitle.style.gridTemplateColumns = rowGrid;
    outputContent.appendChild(dictionaryTitle);
    const dictionaryRows = await createDictionaryRows(elementClass, deleted, 0, searchString, rowGrid);
    outputContent.appendChild(dictionaryRows);
    return outputContent;
}