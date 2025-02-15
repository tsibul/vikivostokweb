'use strict'

import {createDropDown} from "../../dropDown/createDropDown.js";

/**
 * create field for foreign key
 * @param fieldName
 * @param fieldValue
 * @param url
 * @returns {HTMLInputElement}
 */
export async function createForeignField(fieldName, fieldValue, url) {
  const input = await createDropDown(fieldName.foreignClass, fieldValue)
  return input;

}