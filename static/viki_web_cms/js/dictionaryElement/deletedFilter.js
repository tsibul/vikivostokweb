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
    const dictionarySection = deletedCheck.closest('.dictionary-frame');
    let searchString = dictionarySection.querySelector('.dictionary-frame__input').textContent;
    await reloadContent(dictionarySection, className, deletedCheck, searchStringNormalizer(searchString));
}