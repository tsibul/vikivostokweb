'use strict'

/**
 * create field for foreign key
 * @param fieldName
 * @param fieldValue
 * @param url
 * @returns {HTMLInputElement}
 */
export function createForeignField(fieldName, fieldValue, url) {
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('modal__content_text');
  input.value = fieldValue;
  return input;

}