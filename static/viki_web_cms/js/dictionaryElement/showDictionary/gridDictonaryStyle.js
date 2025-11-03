'use strict'

export function gridDictionaryStyle(fields) {
    let elementStile = '14px 6fr ';
    fields.forEach(field => {
        if (field.field !== 'name') {
            if (
                field.type === 'boolean' ||
                field.type === 'number' ||
                field.type === 'float' ||
                field.type === 'precise') {
                elementStile = elementStile + '1fr '

            } else if (field.type === 'textarea') {
                elementStile = elementStile + '6fr '
            } else {
                elementStile = elementStile + '3fr ';
            }
        }
    });
    elementStile = elementStile + '80px'
    return elementStile;
}