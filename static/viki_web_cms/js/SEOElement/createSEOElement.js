/**
 * @fileoverview Module for creating goods element
 * @module goodsElement/createGoodsElement
 */

'use strict'

import {createDictionaryContent} from "../dictionaryElement/showDictionary/createDictionaryContent.js";

/**
 * Creates seo element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created goods element
 */
export async function createSEOElement(className){
    const rowGrid = '14px 1fr 24px 1fr 2fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr 36px 36px 0.8fr'
    const dictionaryContent = await createDictionaryContent(className, rowGrid, 0,0, 'None');
    dictionaryContent.id = className;
    dictionaryContent.dataset.grid = rowGrid;
    return dictionaryContent;
}