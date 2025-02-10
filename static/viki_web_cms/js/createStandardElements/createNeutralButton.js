'use strict'

export function createNeutralButton(textContent){
    const neutralBtn = document.createElement('button');
    neutralBtn.classList.add('btn', 'btn__neutral');
    neutralBtn.textContent = textContent;
    return neutralBtn;
}