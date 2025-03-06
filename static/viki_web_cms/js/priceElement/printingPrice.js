'use strict'

import {jsonUrl} from "../main.js";

export async function printingPrice(priceDate, searchString) {
    const priceContent = document.createElement('form');
    const priceUrl = jsonUrl + 'printing_price_data/' + priceDate + '/'
        + priceType + '/' + searchString;
    return priceContent
}