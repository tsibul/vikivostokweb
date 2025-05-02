/**
 * @fileoverview Module for loading more user records 
 * @module userElement/loadMoreUsers
 */

'use strict';

import { createUserRows } from './createUserRows.js';

/**
 * Loads the next 20 user records and appends them to the existing rows
 * @param {HTMLElement} element - The trigger element that initiated the load
 * @param {string} className - CSS class name for the element
 * @param {boolean} newOnly - Whether to show only new users
 * @param {string} searchString - Search string to filter users
 * @param {number} lastRecord - Last record number to start from
 * @returns {Promise<void>}
 */
export async function loadMoreUsers(element, className, newOnly, searchString, lastRecord) {
    const dictionaryRows = element.closest('.dictionary-content__rows');
    
    // Создаем новые строки, начиная с последней записи
    const newRows = await createUserRows(className, lastRecord, searchString, newOnly);
    const newRowsList = newRows.children;
    
    // Добавляем новые строки в существующий контейнер
    [...newRowsList].forEach(el => {
        dictionaryRows.appendChild(el);
    });
    
    // Заменяем триггер-элемент его клоном для сброса обработчиков событий
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
} 