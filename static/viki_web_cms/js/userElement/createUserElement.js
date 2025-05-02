/**
 * @fileoverview Module for creating user element
 * @module userElement/createUserElement
 */

'use strict';

import { createUserDictionary } from "./createUserDictionary.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createUserElement(className) {
    // Создаем контент для пользователей
    const userDictionary = await createUserDictionary(className);
    
    // Устанавливаем id для возможного последующего обращения
    userDictionary.id = className;
    
    return userDictionary;
}