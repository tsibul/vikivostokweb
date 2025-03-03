'use strict'

import {uploadCsvCatalogue} from "../catalogueElement/uploadCatalogueModal.js";

export async function csvUpload(className) {
    switch (className) {
        case 'Catalogue':
            uploadCsvCatalogue();
            break;
        case 'Price':
            break;
        default:
    }

}