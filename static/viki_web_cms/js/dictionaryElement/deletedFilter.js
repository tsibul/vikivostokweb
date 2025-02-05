'use strict';

import {createDictionaryContent} from "./showDictionary/createDictionaryContent.js";

export async function deletedFilter(className, deletedCheck) {
    const searchString = deletedCheck.closest('.dictionary-frame__header_right')
        .querySelector('.dictionary-frame__input')
        .textContent;
    const dictionarySection = deletedCheck.closest('.dictionary-frame');
    let dictionaryContent = dictionarySection.querySelector('.dictionary-content');
    dictionaryContent.remove();
    dictionaryContent = await createDictionaryContent(className,
        deletedCheck.checked ? 0 : 1,
        searchString ? searchString : 'None');
    dictionarySection.appendChild(dictionaryContent);
}