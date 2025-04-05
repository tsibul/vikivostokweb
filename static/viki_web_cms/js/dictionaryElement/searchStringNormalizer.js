/**
 * @fileoverview Module for normalizing search strings
 * @module dictionaryElement/searchStringNormalizer
 */

'use strict'

import {searchStringValidator} from "./searchStringValidator.js";

/**
 * Normalizes search string according to validator rules
 * @param {string} searchString - String to normalize
 * @returns {string} Normalized string or 'None' if invalid
 */
export function searchStringNormalizer(searchString) {
    let normalizedSearchString = searchString;
    if (!searchStringValidator(searchString) || !searchString) {
        normalizedSearchString = 'None';
    }
    return normalizedSearchString.replace(/ /g, "|");
}