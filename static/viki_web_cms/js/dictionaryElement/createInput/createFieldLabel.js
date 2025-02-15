'use strict'

/**
 * create frame field label + field input
 * @param text
 * @returns {HTMLDivElement}
 */
export function createFieldLabel(text) {
    const fieldLabel = document.createElement('label');
    fieldLabel.classList.add('modal__content_label');
    fieldLabel.htmlFor = text.field + 'Input';
    fieldLabel.textContent = text.label;
    return fieldLabel;
}