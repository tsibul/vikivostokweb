import {toggleActive} from "./toggleActive.js";
import {createDictionaryFrame} from "./showDictionary/createDictionaryFrame.js";
import {createDictionaryContent} from "./showDictionary/createDictionaryContent.js";


/**
 * create dictionary section if not exist, toggle visibility if exist
 * toggle active on element & parent section
 * @param divElement menu element click
 * @param divElementClass dictionary class corresponding to element
 * @param divElementUpload if possible to upload file with data
 * @param details parent menu section of clicked element
 * @param childList clicked element siblings
 * @returns {Promise<void>}
 */
export async function toggleDictionary(divElement, divElementClass, divElementUpload, details, childList) {
    divElement.classList.toggle('text-active');
    if (!document.getElementById(divElementClass)) {
        const contentRight = document.querySelector('.content__right');
        const dictionaryFrame = await createDictionaryFrame(divElementClass, divElement.textContent, divElementUpload);
        const rowGrid = dictionaryFrame.querySelector('.dictionary-frame__header').dataset.grid;
        const dictionaryContent = await createDictionaryContent(divElementClass, rowGrid, 0, 'None');
        dictionaryFrame.appendChild(dictionaryContent);
        contentRight.appendChild(dictionaryFrame);
    } else {
        document.getElementById(divElementClass).classList.toggle('invisible');
    }
    toggleActive(details, childList);
}