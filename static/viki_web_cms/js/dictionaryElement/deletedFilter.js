'use strict';


import {reloadContent} from "./reloadContent.js";
import {searchStringValidator} from "./searchStringValidator.js";

/**
 * reload content onchange deletedCheck
 * @param className className for selected dictionary
 * @param deletedCheck checked element
 * @returns {Promise<void>}
 */
export async function deletedFilter(className, deletedCheck) {
    const dictionarySection = deletedCheck.closest('.dictionary-frame');
    let searchString = dictionarySection.querySelector('.dictionary-frame__input').textContent;
    !searchStringValidator(searchString) ? searchString = 'None' : null;
    await reloadContent(dictionarySection,className,deletedCheck, searchString);
}