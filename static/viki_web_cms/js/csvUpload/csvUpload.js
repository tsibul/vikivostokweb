'use strict'

import {createCatalogueModal} from "../catalogueElement/createCatalogueModal.js";

export async function csvUpload(className) {
    switch (className) {
        case 'Catalogue':
            createCatalogueModal();
            break;
        case 'Price':
            break;
        default:
    }

}