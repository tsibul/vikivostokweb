'use strict'

import {reloadContent} from "./reloadContent.js";
import {searchStringNormalizer} from "./searchStringNormalizer.js";

/**
 * reload dictionary content onclick search button
 * @param button search button
 * @param className
 * @returns {Promise<void>}
 */
export async function searchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame__header').parentElement;
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').value;
    const deletedCheck = dictionarySection.querySelector('.check');
    await reloadContent(dictionarySection, className, deletedCheck, searchStringNormalizer(searchString));
}