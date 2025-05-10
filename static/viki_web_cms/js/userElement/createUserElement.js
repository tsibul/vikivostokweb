/**
 * @fileoverview Module for creating user element
 * @module userElement/createUserElement
 */

'use strict';

import {createUserDictionary} from "./createUserDictionary.js";
import {createUserRows} from "./createUserRows.js";
import {setupHeaderHandlers, updateContent} from "../fullScreenElement/headerHandlers.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createUserElement(className) {
    setupHeaderHandlers(createUserRows);
    const userDictionary = await createUserDictionary();
    userDictionary.id = className;
    return userDictionary;
}

