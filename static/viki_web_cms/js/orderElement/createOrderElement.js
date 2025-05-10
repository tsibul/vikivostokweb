'use strict';

import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createOrderRow} from "./createOrderRows.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";
import {getOrderData} from "./getOrderData.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createOrderElement(className) {
    const headerStyle = 'order-element__header';
    setupHeaderHandlers(getOrderData, createOrderRow, headerStyle);
    const columns = [
        {title: 'номер'},
        {title: 'дата'},
        {title: 'от'},
        {title: 'клиент'},
        {title: 'статус'},
        {title: 'дней'},
        {title: 'срок'},
        {title: 'макет'},
        {title: 'счет'},
        {title: 'накл.'},
        {title: ''},
    ];
    return await createPageContent('order-content', columns, headerStyle,
        getOrderData, createOrderRow);
}

