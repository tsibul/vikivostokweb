'use strict'

import {createStringField} from "./createStringField.js";
import {createBooleanField} from "./createBooleanField.js";
import {createNumberField} from "./createNumberField.js";
import {createForeignField} from "./createForeignField.js";
import {createImageField} from "./createImageField.js";
import {getFieldStructure} from "../getFieldStructure.js";
import {jsonUrl} from "../../main.js";
import {fetchJsonData} from "../../fetchJsonData.js";
import {createFileField} from "./createFileField.js";
import {createFieldLabel} from "./createFieldLabel.js";

const fieldCreation = {
    'string': createStringField,
    'boolean': createBooleanField,
    'number': createNumberField,
    'foreign': createForeignField,
    'image': createImageField,
    'file': createFileField,
};

/**
 * create editable fields for modal
 * @param modal
 * @param className
 * @param elementId
 * @returns {Promise<HTMLDivElement>}
 */
export async function createModalContent(modal, className, elementId) {
    const modalContent = document.createElement("div");
    modalContent.classList.add('modal__content');
    const titleObject = await getFieldStructure(className);
    let tmpField;
    const url = jsonUrl + 'record_info/' + className + '/' + elementId;
    const recordInfo = await fetchJsonData(url);
    if (elementId !== '0') {
        titleObject.forEach(field => {
            modalContent.appendChild(createFieldLabel(field))
            tmpField = fieldCreation[field.type](field, recordInfo.record[field.field], recordInfo.url);
            tmpField.name = field.field;
            modalContent.appendChild(tmpField);
        });
    } else {
        titleObject.forEach(field => {
            modalContent.appendChild(createFieldLabel(field))
            tmpField = fieldCreation[field.type](field, null, recordInfo.url);
            tmpField = field.field;
            modalContent.appendChild(tmpField);
        });
    }
    return modalContent;
}