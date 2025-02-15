'use strict'

import {createDropDown} from "../../dropDown/createDropDown.js";

/**
 * create field for foreign key
 * @returns {HTMLInputElement}
 * @param fieldData
 */
export async function createForeignField(fieldData) {
    const fieldClass = fieldData.fieldName.foreignClass;
    const fieldValue = fieldData.fieldValue;
    const input = await createDropDown(fieldClass, fieldValue)
    return input;

}