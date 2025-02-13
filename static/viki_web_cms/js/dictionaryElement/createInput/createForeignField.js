'use strict'

import {createFieldFrame} from "./createFieldFrame.js";

export function createForeignField(fieldName, fieldValue, url) {
  const fieldFrame = createFieldFrame(fieldName);
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('modal__content_text');
  input.value = fieldValue;
  fieldFrame.appendChild(input);
  return fieldFrame;

}