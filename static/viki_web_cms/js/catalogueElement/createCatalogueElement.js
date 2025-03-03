'use strict'

import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {catalogueFields} from "./catalogueFields.js";
import {createCatalogueContent} from "./createCatalogueContent.js";
import {createCatalogueRow} from "./createCatalogueRow.js";
import {createNeutralButton} from "../createStandardElements/createNeutralButton.js";
import {massImagesUpload} from "./massImagesUpload.js";

export async function createCatalogueElement(className) {
    const headerRight = document.querySelector('.dictionary-frame__header_right');
    const uploadButton = createNeutralButton('Загрузить несколько фото');
    uploadButton.addEventListener('click', () => massImagesUpload());
    headerRight.insertAdjacentElement('afterbegin', uploadButton);
    const catalogue = document.createElement('div');
    const catalogueTitle = document.createElement('div')
    catalogueTitle.classList.add('catalogue', 'catalogue__title');
    let titleItem;
    catalogueFields.forEach(field => {
        titleItem = document.createElement('p');
        titleItem.classList.add('catalogue__title-item');
        titleItem.textContent = field.label;
        catalogueTitle.appendChild(titleItem);
    });
    const newBtn = createSaveButton('Новый');
    newBtn.addEventListener('click', async (e) => {
        e.target.disabled = true;
        e.target.classList.add('btn__disabled');
        const item = {'id': 0};

        const newRow = document.createElement('form');
        await createCatalogueRow(item, newRow)
        const cncBtn = newRow.querySelector('.btn__cancel');
        cncBtn.disabled = false;
        cncBtn.classList.remove('btn__disabled')
        catalogueContent.insertAdjacentElement('afterbegin', newRow);
        newRow.scrollIntoView({behavior: 'smooth'});
        newRow.focus();
    });
    catalogueTitle.appendChild(newBtn);
    catalogue.appendChild(catalogueTitle);
    const catalogueContent = document.createElement('div');
    catalogueContent.classList.add('catalogue__content');
    await createCatalogueContent(catalogueContent, 0, 0, 'None', 0);
    catalogue.appendChild(catalogueContent);
    return catalogue;
}



