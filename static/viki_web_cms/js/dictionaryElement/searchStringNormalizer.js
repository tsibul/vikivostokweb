'use strict'

import {searchStringValidator} from "./searchStringValidator.js";

/**
 * normalize searchString according validator
 * @param searchString
 * @returns {string}
 */
export function searchStringNormalizer(searchString) {
    let normalizedSearchString = searchString;
    if (!searchStringValidator(searchString) || !searchString) {
        normalizedSearchString = 'None';
    }
    return normalizedSearchString.replace(/ /g, "|");
}