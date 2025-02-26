'use strict'

export function createCheckbox(state) {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = state;
    checkBox.classList.add('check');
    return checkBox;
}