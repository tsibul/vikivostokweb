'use strict'


import {createDictionaryContent} from "./showDictionary/createDictionaryContent.js";

export async function reloadContent(dictionarySection, className, deletedCheck, searchString) {
    let dictionaryContent = dictionarySection.querySelector('.dictionary-content');
    dictionaryContent.remove();
    dictionaryContent = await createDictionaryContent(className,
        deletedCheck.checked ? 0 : 1,
        searchString ? searchString : 'None');
    dictionarySection.appendChild(dictionaryContent);
}