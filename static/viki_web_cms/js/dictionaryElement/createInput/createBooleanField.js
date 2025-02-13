'use strict'

import {createFieldFrame} from "./createFieldFrame.js";
import {createModalInput} from "./createModalInput.js";

export function createBooleanField(fieldName, fieldValue) {
  const fieldFrame = createFieldFrame(fieldName);
  const input = createModalInput('checkbox');
  input.checked = fieldValue;
  input.id = fieldName.field +'Input';
  fieldFrame.appendChild(input);
  return fieldFrame;
}