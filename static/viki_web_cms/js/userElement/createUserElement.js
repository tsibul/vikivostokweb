/**
 * @fileoverview Module for creating user element
 * @module userElement/createUserElement
 */

'use strict';

import {createUserRows} from "./createUserRows.js";
import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";
import {createPageHeader} from "../fullScreenElement/createPageHeader.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createUserElement(className) {
    setupHeaderHandlers(createUserRows);
    const columns = [
        {title: 'Фамилия'},
        {title: 'Имя'},
        {title: 'Email'},
        {title: 'Телефон'},
        {title: 'Email-алиас'},
        {title: 'Новый'},
        {title: 'Клиент'},
        {title: ''} // Столбец с кнопкой
    ];
    const headerStyle = 'user-element__header';
    const userDictionary = await createPageContent('dictionary-content', createPageHeader,
        createUserRows, columns, headerStyle);
    userDictionary.id = className;
    return userDictionary;
}

