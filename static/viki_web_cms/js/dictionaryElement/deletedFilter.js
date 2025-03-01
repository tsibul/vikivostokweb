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
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    const normalizedSearchString = searchStringNormalizer(searchString);
    switch (className) {
        case 'Catalogue':


        default:
            await reloadContent(dictionarySection, className, deletedCheck, normalizedSearchString);
    }
}