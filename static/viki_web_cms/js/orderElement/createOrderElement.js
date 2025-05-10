'use strict';



import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createOrderDictionary} from "./createOrderDictionary.js";
import {createOrderRows} from "./createOrderRows.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createOrderElement(className) {
    setupHeaderHandlers(createOrderRows);
    return await createOrderDictionary();
}

