'use strict'

/**
 * create only image as editing of image in separate interface
 * @returns {HTMLDivElement}
 * @param fieldData
 */
export function createImageField(fieldData) {
    const input = document.createElement('img');
    input.classList.add('modal__content_' + 'image');
    input.src = fieldData.url + fieldData.fieldValue;
    input.alt = fieldData.fieldName.field;
    return input;

}