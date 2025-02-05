'use strict';


import {reloadContent} from "./reloadContent.js";

export async function deletedFilter(className, deletedCheck) {
    const dictionarySection = deletedCheck.closest('.dictionary-frame');
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').textContent;
    await reloadContent(dictionarySection,className,deletedCheck, searchString);
}