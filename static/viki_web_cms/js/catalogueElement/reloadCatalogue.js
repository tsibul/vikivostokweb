'use strict'

import {createCatalogueContent} from "./createCatalogueContent.js";

export async function reloadCatalogue(dictionarySection, deletedCheck, searchString) {
    const catalogue = dictionarySection.querySelector('.catalogue__content');
    catalogue.innerHTML = '';
    await createCatalogueContent(catalogue, deletedCheck.checked ? 0 : 1, 0, searchString, 0);
}