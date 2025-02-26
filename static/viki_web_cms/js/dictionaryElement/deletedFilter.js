'use strict';


import {reloadContent} from "./reloadContent.js";
import {searchStringNormalizer} from "./searchStringNormalizer.js";

/**
 * reload content onchange deletedCheck
 * @param className className for selected dictionary
 * @param deletedCheck checked element
 * @returns {Promise<void>}
 */
export async function deletedFilter(className, deletedCheck) {
    const dictionarySection = deletedCheck.closest('.dictionary-frame__header').parentElement;
    let searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    await reloadContent(dictionarySection, className, deletedCheck, searchStringNormalizer(searchString));
}