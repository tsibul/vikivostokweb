/**
 * @fileoverview Module for loading more user records 
 * @module userElement/loadMoreUsers
 */

'use strict';

import {createRows} from "./createRows.js";

/**
 * Loads the next 20 user records and appends them to the existing rows
 * @param {HTMLElement} element - The trigger element that initiated the load
 * @param {HTMLElement} container
 * @param {boolean} newOnly - Whether to show only new users
 * @param {string} searchString - Search string to filter users
 * @param {number} lastRecord - Last record number to start from
 * @param {function}getData
 * @param {function}createRow
 * @param {string} rowStyle
 * @returns {Promise<void>}
 */
export async function loadMoreRecords(element, container, lastRecord,
                                      searchString, newOnly, getData, createRow, rowStyle) {
    // Защита от случайного вызова с некорректными параметрами
    if (searchString === null || searchString === undefined) {
        searchString = '';
    }

    // Создаем новые строки, начиная с последней записи
    await createRows( container, lastRecord, searchString, newOnly, getData, createRow, rowStyle);
    
    // Заменяем триггер-элемент его клоном для сброса обработчиков событий
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
} 