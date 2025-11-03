import {toggleDictionary} from "../dictionaryElement/toggleDictionary.js";

/**
 * create left menu for standard dictionaries
 * @param content
 * @param leftMenuCode
 */
export function createContentLeft(content, leftMenuCode) {
    content.style.flexDirection = 'row';
    const leftMenuElement = document.createElement("div");
    leftMenuElement.classList.add("content__left");
    content.appendChild(leftMenuElement);
    const rightMenuElement = document.createElement("div");
    rightMenuElement.classList.add("content__right");
    content.appendChild(rightMenuElement);
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
            divElement.dataset.upload = cms.upload;
            divElement.dataset.new = cms.new;
            divElement.classList.add('section-left__content');
            sectionDetails.appendChild(divElement);
        });
        const childList = sectionDetails.querySelectorAll('li');
        childList.forEach((item) => {
            item.addEventListener('click', () =>
                toggleDictionary(item, item.dataset.class, JSON.parse(item.dataset.upload), JSON.parse(item.dataset.new),
                    sectionDetails, childList));
        })
        leftMenuElement.appendChild(sectionDetails);
    });
}
