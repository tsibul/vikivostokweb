'use strict'

import {createModalInput} from "./createModalInput.js";

/**
 * create boolean field for modal as checkbox
 * @param fieldName
 * @param fieldValue
 * @returns {HTMLInputElement}
 */
export function createBooleanField(fieldName, fieldValue) {
  const input = createModalInput('checkbox');
  input.checked = fieldValue;
  input.id = fieldName.field +'Input';
  return input;
}