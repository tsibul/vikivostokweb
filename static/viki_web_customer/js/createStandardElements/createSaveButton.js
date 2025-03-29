'use strict'

export function createSaveButton(textContent){
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('btn', 'btn__save');
    saveBtn.textContent = textContent;
    return saveBtn;
}