'use strict'

export function gridDictionaryStyle(fields) {
    let elementStile = '14px ';
    fields.forEach(field => {
        field.type === 'boolean' || field.type === 'number'
            ? elementStile = elementStile + '1fr '
            : elementStile = elementStile + '4fr ';
    })
    elementStile = elementStile + '80px'
    return elementStile;
}