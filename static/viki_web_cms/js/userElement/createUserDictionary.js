/**
 * @fileoverview Module for creating the complete user dictionary content
 * @module userElement/createUserDictionary
 */

'use strict';

import { createUserHeader } from './createUserHeader.js';
import { createUserRows } from './createUserRows.js';

/**
 * Creates the complete user dictionary content with header and rows
 * @param {string} className - CSS class name for the element
 * @param {number} lastRecord - Last record number to start from
 * @param {string} searchString - Search string to filter users
 * @param {boolean} newOnly - Whether to show only new users
 * @returns {Promise<HTMLElement>} Container with user dictionary content
 */
export async function createUserDictionary(className, lastRecord = 0, searchString = '', newOnly = false) {
    const container = document.createElement('div');
    container.classList.add('dictionary-content');
    
    // Создаем заголовок
    const header = createUserHeader();
    container.appendChild(header);
    
    // Создаем строки
    const rows = await createUserRows(className, lastRecord, searchString, newOnly);
    container.appendChild(rows);
    
    return container;
} 