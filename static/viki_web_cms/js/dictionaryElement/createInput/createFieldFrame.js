'use strict'

/**
 * create frame field label + field input
 * @param text
 * @returns {HTMLDivElement}
 */
export function createFieldFrame(text) {
    const fieldFrame = document.createElement('div');
    fieldFrame.classList.add('modal__content_item');
    const fieldLabel = document.createElement('label');
    fieldLabel.classList.add('modal__content_label');
    fieldLabel.htmlFor = text.field + 'Input';
    fieldLabel.textContent = text.label;
    fieldFrame.appendChild(fieldLabel);
    return fieldFrame;
}