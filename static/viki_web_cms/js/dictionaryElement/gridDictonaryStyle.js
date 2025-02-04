'use strict'

export function gridDictionaryStyle(element, fields) {
    let elementStile = '';
    fields.forEach(field => {
        field.type === 'boolean' || field.type === 'number'
            ? elementStile = elementStile + '1fr '
            : elementStile = elementStile + '4fr ';
    })
    elementStile = elementStile + '80px'
    element.style.gridTemplateColumns = elementStile;
}