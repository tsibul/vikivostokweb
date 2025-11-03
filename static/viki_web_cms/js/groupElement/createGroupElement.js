'use strict';

import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";
import {createGroupRow} from "./createGroupRows.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createGroupElement(className) {
    const headerStyle = 'group-element__header';
    setupHeaderHandlers(createGroupRow, headerStyle, '/cms/json/customer_list');
    const columns = [
        {title: 'название'},
        {title: 'почта'},
        {title: 'новый'},
        {title: 'тип цены'},
        {title: 'менеджер'},
        {title: 'кол-во'},
        {title: ''},
        {title: ''},
    ];
    return await createPageContent('group-content', columns, headerStyle,
        createGroupRow, '/cms/json/customer_list');
}




