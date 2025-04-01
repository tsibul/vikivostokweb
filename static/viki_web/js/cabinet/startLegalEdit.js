'use strict';

export function startLegalEdit(data) {
    const dataChange = data.querySelector('.personal-data__change');
    const dataSave = data.querySelector('.personal-data__save');
    dataChange.classList.toggle('item-hidden');
    dataSave.classList.toggle('item-hidden');
    const form = data.querySelector('form')
    const dataDisabled = form.querySelectorAll('.input-disabled');
    [...dataDisabled].forEach(input => {
        input.disabled = false;
    });
    data.querySelector('.alert').textContent = '';
}