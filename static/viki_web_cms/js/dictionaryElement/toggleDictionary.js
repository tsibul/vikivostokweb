import {toggleActive} from "./toggleActive.js";
import {createDictionaryFrame} from "./createDictionaryFrame.js";
import {createDictionaryContent} from "./createDictionaryContent.js";

export async function toggleDictionary(divElement, divElementClass, details, childList) {
    divElement.classList.toggle('text-active');
    if (!document.getElementById(divElementClass)) {
        const contentRight = document.querySelector('.content__right');
        const dictionaryFrame = createDictionaryFrame(divElementClass, divElement.textContent);
        const dictionaryContent = await createDictionaryContent(divElementClass);
        dictionaryFrame.appendChild(dictionaryContent);
        contentRight.appendChild(dictionaryFrame);
    } else {
        document.getElementById(divElementClass).classList.toggle('invisible');
    }
    toggleActive(details, childList);
}