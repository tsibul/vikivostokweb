/**
 * @fileoverview Module for toggling dictionary visibility
 * @module dictionaryElement/toggleDictionary
 */

import {toggleActive} from "./toggleActive.js";
import {createDictionaryFrame} from "./showDictionary/createDictionaryFrame.js";
import {createDictionaryContent} from "./showDictionary/createDictionaryContent.js";
import {gridDictionaryStyle} from "./showDictionary/gridDictonaryStyle.js";
import {getFieldStructure} from "./getFieldStructure.js";


/**
 * Creates dictionary section if it doesn't exist, toggles visibility if it does
 * Toggles active state on element and parent section
 * @param {HTMLDivElement} divElement - Menu element that was clicked
 * @param {string} divElementClass - Dictionary class corresponding to element
 * @param {boolean} divElementUpload - Whether file upload is possible
 * @param {boolean} divElementNew - Whether new item is possible
 * @param {HTMLDetailsElement} details - Parent menu section of clicked element
 * @param {HTMLCollection} childList - Siblings of clicked element
 * @returns {Promise<void>}
 */
export async function toggleDictionary(divElement, divElementClass, divElementUpload, divElementNew, details, childList) {
    divElement.classList.toggle('text-active');
    if (!document.getElementById(divElementClass)) {
        const contentRight = document.querySelector('.content__right');
        const dictionaryFrame = await createDictionaryFrame(divElementClass, divElement.textContent, divElementUpload, divElementNew);
        const titleObject = await getFieldStructure(divElementClass);
        const rowGrid = gridDictionaryStyle(titleObject);
        const dictionaryContent = await createDictionaryContent(divElementClass, rowGrid, 0, 'None');
        dictionaryFrame.appendChild(dictionaryContent);
        contentRight.appendChild(dictionaryFrame);
    } else {
        document.getElementById(divElementClass).classList.toggle('invisible');
    }
    toggleActive(details, childList);
}