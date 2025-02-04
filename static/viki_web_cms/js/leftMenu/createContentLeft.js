import {toggleDictionary} from "../dictionaryElement/toggleDictionary.js";

export function createContentLeft(leftMenuElement, leftMenuCode) {
    const leftMenu = JSON.parse(leftMenuCode);
    leftMenu.forEach((item) => {
        let sectionDetails = document.createElement('details');
        sectionDetails.classList.add('section-left');
        let sectionSummary = document.createElement('summary');
        sectionSummary.textContent = item.section_name;
        sectionDetails.appendChild(sectionSummary);
        item.cms_settings.forEach(cms => {
            let divElement = document.createElement('li');
            divElement.textContent = cms.setting;
            divElement.dataset.class = cms.setting_class;
            divElement.classList.add('section-left__content');
            sectionDetails.appendChild(divElement);
        });
        const childList = sectionDetails.querySelectorAll('li');
        childList.forEach((item) => {
            item.addEventListener('click',() =>
                toggleDictionary(item, item.dataset.class, sectionDetails, childList));
        })
        leftMenuElement.appendChild(sectionDetails);
    });
}
