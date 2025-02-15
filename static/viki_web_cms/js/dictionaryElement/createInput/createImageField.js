'use strict'

/**
 * create only image as editing of image in separate interface
 * @param fieldName
 * @param fieldValue
 * @param url
 * @returns {HTMLDivElement}
 */
export function createImageField(fieldName, fieldValue, url) {
    const input = document.createElement('div');
    input.classList.add('modal__content_' + 'image');
    input.src = url + fieldValue;
    input.alt = fieldName.field;
    return input;

}