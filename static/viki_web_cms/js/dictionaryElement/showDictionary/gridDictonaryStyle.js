'use strict'

export function gridDictionaryStyle(fields) {
    let elementStile = '14px 6fr ';
    fields.forEach(field => {
        if (field.field !== 'name') {
            field.type === 'boolean' || field.type === 'number'
                ? elementStile = elementStile + '1fr '
                : elementStile = elementStile + '3fr ';
        }
    });
    elementStile = elementStile + '80px'
    return elementStile;
}