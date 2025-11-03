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
import {createFloatField} from "./createFloatField.js";
import {createPreciseFloatField} from "./createPreciseFloatField.js";
import {createDateField} from "./createDateField.js";
import {createTextAreaField} from "./createTextAreaField.js";

const fieldCreation = {
    'string': createStringField,
    'boolean': createBooleanField,
    'number': createNumberField,
    'float': createFloatField,
    'precise': createPreciseFloatField,
    'foreign': createForeignField,
    'image': createImageField,
    'file': createFileField,
    'date': createDateField,
    'textarea': createTextAreaField,
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
    for (const field of titleObject) {
        let fieldData = {
            'fieldName': field,
            'fieldValue': null,
            'url': recordInfo.url
        }
        if (elementId !== '0') {
            if (field.type !== 'foreign') {
                if (!field.property_off) {
                    fieldData.fieldValue = recordInfo.record[field.field];
                } else {
                    fieldData.fieldValue = recordInfo.record[field.property_off];
                    // fieldData.fieldValue = recordInfo.record[field.property_off];
                }
            } else {
                fieldData.fieldValue = recordInfo.record[field.field + '_id'];
            }
        }
        modalContent.appendChild(createFieldLabel(field))
        tmpField = await fieldCreation[field.type](fieldData);
        modalContent.appendChild(tmpField);
    }
    return modalContent;
}