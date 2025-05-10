'use strict';

/**
 *
 * @param {Array} columns
 * @param {string} headerStyle
 * @returns {HTMLDivElement}
 */
export function createPageHeader(columns, headerStyle) {
    const headerRow = document.createElement('div');
    headerRow.classList.add('dictionary-content__title', headerStyle);

    // Создаем ячейки заголовка
    columns.forEach(column => {
        const cell = document.createElement('div');
        cell.classList.add('dictionary-content__title_item', 'user-element__header-item');
        cell.textContent = column.title;
        headerRow.appendChild(cell);
    });

    return headerRow;
}