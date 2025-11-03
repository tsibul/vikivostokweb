/**
 * @fileoverview Module for creating price content based on price type
 * @module priceElement/createPriceContent
 */

'use strict';

import {searchStringNormalizer} from "../dictionaryElement/searchStringNormalizer.js";
import {standardPrice} from "./standardPrice.js";
import {volumePrice} from "./volumePrice.js";
import {printingPrice} from "./printingPrice.js";

/**
 * Creates price content based on the specified price type
 * @param {string} priceDate - Price list date identifier
 * @param {string} priceType - Type of price list (1: standard, 2: volume, 3: printing)
 * @param {string} searchString - Search string for filtering content
 * @returns {Promise<{form: HTMLFormElement, header: HTMLElement}>} Object containing form and header elements
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