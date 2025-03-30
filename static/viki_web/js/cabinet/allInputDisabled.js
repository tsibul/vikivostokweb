'use strict';

export function allInputDisabled() {
    const inputDisabled = document.querySelectorAll('.input-disabled');
    [...inputDisabled].forEach(input => {
        input.disabled = true;
    });
}