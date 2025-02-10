'use strict'

export function createCancelButton(textContent) {
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('btn', 'btn__cancel');
    cancelBtn.textContent = textContent;
    return cancelBtn;
}