/**
 * @fileoverview Module for creating user dictionary header
 * @module userElement/createUserHeader
 */

'use strict';

/**
 * Creates header row for user dictionary with column titles
 * @returns {HTMLElement} Header row element
 */
export function createUserHeader() {
    const headerRow = document.createElement('div');
    headerRow.classList.add('dictionary-content__title', 'user-element__header');
    
    // Определяем заголовки столбцов
    const columns = [
        { title: 'Фамилия' },
        { title: 'Имя' },
        { title: 'Email' },
        { title: 'Телефон' },
        { title: 'Email-алиас' },
        { title: 'Новый' },
        { title: 'Менеджер' },
        { title: 'Клиент' },
        { title: '' } // Столбец с кнопкой
    ];
    
    // Создаем ячейки заголовка
    columns.forEach(column => {
        const cell = document.createElement('div');
        cell.classList.add('dictionary-content__title_item', 'user-element__header-item');
        cell.textContent = column.title;
        headerRow.appendChild(cell);
    });
    
    return headerRow;
} 