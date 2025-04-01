'use strict';

export function fillInputsWithData(data, form) {
    [...form.querySelectorAll('input')].forEach(input => {
        input.value = data[input.dataset.name];
    });
}