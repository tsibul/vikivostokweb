/**
 * @fileoverview Module for creating goods element
 * @module goodsElement/createGoodsElement
 */

'use strict'

import {createDictionaryContent} from "../dictionaryElement/showDictionary/createDictionaryContent.js";

/**
 * Creates goods element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created goods element
 */
export async function createGoodsElement(className){
    const rowGrid = '14px 1.5fr 4fr 1fr 1fr 1fr 3fr 3fr 3fr 2fr 2fr 1fr 1fr 1fr 1fr 1fr 3fr 1.5fr'
    const dictionaryContent = await createDictionaryContent(className, rowGrid, 0,0, 'None');
    dictionaryContent.id = className;
    dictionaryContent.dataset.grid = rowGrid;
    return dictionaryContent;
}