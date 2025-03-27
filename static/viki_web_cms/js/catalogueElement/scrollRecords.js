'use strict'

import {createCatalogueContent} from "./createCatalogueContent.js";
import {searchStringNormalizer} from "../dictionaryElement/searchStringNormalizer.js";

export async function scrollRecords(e) {
    const currentRecord = e.target;
    const firstRecord = currentRecord.dataset.lastId;
    const content = currentRecord.closest('.content');
    const searchString = content.querySelector('.dictionary-frame__input').value;
    const deletedCheck = content.querySelector('.check');
    const catalogueContent= content.querySelector('.catalogue__content');
    await createCatalogueContent(catalogueContent, deletedCheck.checked ? 1 :0, firstRecord,
        searchStringNormalizer(searchString), 0);
}