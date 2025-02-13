'use strict'

/**
 * create input with specified type
 * @param inputType
 * @returns {HTMLInputElement}
 */
export function createModalInput(inputType) {
    const input = document.createElement('input');
    input.type = inputType;
    input.classList.add('modal__content_' + inputType);
    return input;
}