'use strict'

/**
 * create frame field label + field input
 * @param fieldData
 * @returns {HTMLDivElement}
 */
export function createFieldLabel(fieldData) {
    const fieldLabel = document.createElement('label');
    fieldLabel.classList.add('modal__content_label');
    fieldLabel.htmlFor = fieldData.field + 'Input';
    fieldLabel.textContent = fieldData.label + (fieldData['null'] ? '' : '*');
    return fieldLabel;
}