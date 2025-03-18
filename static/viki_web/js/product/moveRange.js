'use strict'

export function moveRange(e){
    const value = e.target.value;
    const showField = e.target.nextElementSibling;
    showField.textContent = value;
}