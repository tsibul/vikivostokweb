'use strict';

import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createOrderRows} from "./createOrderRows.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";
import {createPageHeader} from "../fullScreenElement/createPageHeader.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createOrderElement(className) {
    setupHeaderHandlers(createOrderRows);
    const columns = [];
    const headerStyle = 'order-element__header';
    return await createPageContent('order-content', createPageHeader, createOrderRows, columns, headerStyle);
}

