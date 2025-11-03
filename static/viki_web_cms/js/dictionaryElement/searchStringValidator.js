/**
 * @fileoverview Module for validating search strings
 * @module dictionaryElement/searchStringValidator
 */

'use strict'

/**
 * Validates if search string contains only Cyrillic, Latin, numbers, spaces, underscores, or hash symbols
 * @param {string} searchString - String to validate
 * @returns {boolean} True if string is valid, false otherwise
 */
export function searchStringValidator(searchString) {
        const validator = /^[a-zA-Zа-яА-ЯёЁ0-9 ._#]*$/;
        return validator.test(searchString);
}