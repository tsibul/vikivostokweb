/**
 * @fileoverview Module for creating user element
 * @module userElement/createUserElement
 */

'use strict';

import {createUserRow} from "./createUserRows.js";
import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";
import {getUserExtensionData} from "./getUserExtensionData.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createUserElement(className) {
    const headerStyle = 'user-element__header';
    setupHeaderHandlers(getUserExtensionData, createUserRow, headerStyle);
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
    const userDictionary = await createPageContent('dictionary-content', columns, headerStyle,
        getUserExtensionData, createUserRow);
    userDictionary.id = className;
    return userDictionary;
}

