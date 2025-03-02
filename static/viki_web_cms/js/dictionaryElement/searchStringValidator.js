'use strict'

/**
 * validate if searchString is Cyrillic, Latin, '_', ' ' or '#'
 * @param searchString
 * @returns {boolean}
 */
export function searchStringValidator(searchString) {
        const validator = /^[a-zA-Zа-яА-ЯёЁ0-9 ._#]*$/;
        return validator.test(searchString);
}