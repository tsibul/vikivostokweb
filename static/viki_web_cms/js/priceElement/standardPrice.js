'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";

export async function standardPrice(priceDate, searchString) {
    const priceForm = document.createElement('form');
    const priceHeader = priceHeaderBuild();

    const priceUrl = jsonUrl + 'standard_price_data/' + priceDate + '/' + searchString;
    const priceData = await fetchJsonData(priceUrl);
    return {'form': priceForm, 'header': priceHeader};
}

function priceHeaderBuild() {
    const priceHeader = document.createElement('header');
    return priceHeader;
}
