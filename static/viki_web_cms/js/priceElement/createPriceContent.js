'use strict';

import {searchStringNormalizer} from "../dictionaryElement/searchStringNormalizer.js";
import {standardPrice} from "./standardPrice.js";
import {volumePrice} from "./volumePrice.js";
import {printingPrice} from "./printingPrice.js";

/**
 * chose content according to priceList type
 * @param priceDate
 * @param priceType
 * @param searchString
 * @returns {Promise<HTMLFormElement>}
 */
export async function createPriceContent(priceDate, priceType, searchString) {
    switch (priceType) {
        case '1':
            return standardPrice(priceDate, searchStringNormalizer(searchString));
        case '2':
            return volumePrice(priceDate, searchStringNormalizer(searchString));
        case '3':
            return printingPrice(priceDate, searchStringNormalizer(searchString));
    }
}