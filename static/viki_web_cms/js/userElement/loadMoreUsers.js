/**
 * @fileoverview Module for loading more user records 
 * @module userElement/loadMoreUsers
 */

'use strict';

import { createUserRows } from './createUserRows.js';

/**
 * Loads the next 20 user records and appends them to the existing rows
 * @param {HTMLElement} element - The trigger element that initiated the load
 * @param {HTMLElement} container
 * @param {boolean} newOnly - Whether to show only new users
 * @param {string} searchString - Search string to filter users
 * @param {number} lastRecord - Last record number to start from
 * @returns {Promise<void>}
 */
export async function loadMoreUsers(element, container, lastRecord, searchString, newOnly) {
    // Защита от случайного вызова с некорректными параметрами
    if (searchString === null || searchString === undefined) {
        searchString = '';
    }

    // Создаем новые строки, начиная с последней записи
    const newRows = await createUserRows( container, lastRecord, searchString, newOnly);
    
    // Проверяем, что получены дочерние элементы
    // if (!newRows || !newRows.children || newRows.children.length === 0) {
    //     // Если данных больше нет, удаляем триггер
    //     element.remove();
    //     return;
    // }

    // Заменяем триггер-элемент его клоном для сброса обработчиков событий
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
} 