/**
 * @fileoverview Module for creating user rows in dictionary
 * @module userElement/createUserRows
 */

'use strict';

import { getUserExtensionData } from './getUserExtensionData.js';
import { loadMoreUsers } from './loadMoreUsers.js';

/**
 * Creates user rows for the dictionary display
 * @param {string} className - CSS class name for the element
 * @param {number} lastRecord - Last record number to start from
 * @param {string} searchString - Search string to filter users
 * @param {boolean} newOnly - Whether to show only new users
 * @returns {Promise<HTMLElement>} Container with user rows
 */
export async function createUserRows(className, lastRecord = 0, searchString = '', newOnly = false) {
    const container = document.createElement('div');
    container.classList.add('dictionary-content__rows');
    
    try {
        // Получаем данные пользователей с бэкенда
        const userData = await getUserExtensionData(lastRecord, searchString, newOnly);
        console.log('User data received:', userData); // Отладочный вывод
        
        // Проверяем структуру полученных данных
        const userList = userData.userList || [];
        const last_record = userData.last_record || lastRecord;
        
        if (userList && userList.length > 0) {
            // Создаем строки для каждого пользователя
            userList.forEach(user => {
                const row = document.createElement('div');
                row.classList.add('dictionary-content__row', 'user-element__header');
                row.dataset.id = user.id;
                
                // // Столбец с чекбоксом
                // const checkboxCell = document.createElement('div');
                // checkboxCell.classList.add('user-element__cell', 'user-element__cell-checkbox');
                // const checkbox = document.createElement('input');
                // checkbox.type = 'checkbox';
                // checkbox.classList.add('dictionary-content__check');
                // checkboxCell.appendChild(checkbox);
                // row.appendChild(checkboxCell);
                
                // Столбец с фамилией
                const lastNameCell = document.createElement('div');
                lastNameCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-lastname');
                lastNameCell.textContent = user.last_name || '';
                row.appendChild(lastNameCell);
                
                // Столбец с именем
                const firstNameCell = document.createElement('div');
                firstNameCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-firstname');
                firstNameCell.textContent = user.first_name || '';
                row.appendChild(firstNameCell);
                
                // Столбец с email
                const emailCell = document.createElement('div');
                emailCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-email');
                emailCell.textContent = user.email || '';
                row.appendChild(emailCell);
                
                // Столбец с телефоном
                const phoneCell = document.createElement('div');
                phoneCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-phone');
                phoneCell.textContent = user.phone || '';
                row.appendChild(phoneCell);
                
                // Столбец с email-алиасом
                const aliasCell = document.createElement('div');
                aliasCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-alias');
                aliasCell.textContent = user.alias || '';
                row.appendChild(aliasCell);
                
                // Столбец с индикатором нового пользователя
                const newCell = document.createElement('div');
                newCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-new');
                if (user.new) {
                    const newIndicator = document.createElement('div');
                    newIndicator.classList.add('dictionary-content__square', 'user-element__new-indicator');
                    newCell.appendChild(newIndicator);
                }
                row.appendChild(newCell);
                
                // Столбец с менеджером
                const managerCell = document.createElement('div');
                managerCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-manager');
                managerCell.textContent = user.manager_letter || '';
                row.appendChild(managerCell);
                
                // Столбец с клиентом
                const customerCell = document.createElement('div');
                customerCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-customer');
                customerCell.textContent = user.customer || '';
                row.appendChild(customerCell);
                
                // Столбец с кнопкой (без функциональности)
                const buttonCell = document.createElement('div');
                buttonCell.classList.add('user-element__cell');
                const button = document.createElement('button');
                button.classList.add('btn', 'btn__save');
                button.textContent = 'Изм.';
                buttonCell.appendChild(button);
                row.appendChild(buttonCell);
                
                container.appendChild(row);
            });
            
            // Добавляем триггер загрузки дополнительных записей, если есть ровно 20 записей (потенциально есть еще)
            if (userList.length === 20) {
                const loadMoreRow = document.createElement('div');
                loadMoreRow.classList.add('dictionary-content__row', 'user-element__row', 'load-more-trigger');
                
                // Добавляем обработчик события для загрузки дополнительных записей
                loadMoreRow.addEventListener('mouseover', () => {
                    loadMoreUsers(
                        loadMoreRow, 
                        className, 
                        newOnly, 
                        searchString, 
                        last_record
                    );
                });
                
                // Заполняем строку пустыми ячейками (должно соответствовать количеству столбцов в таблице)
                // Всего 10 столбцов: чекбокс, фамилия, имя, email, телефон, email-алиас, новый, менеджер, клиент, кнопка
                const cellCount = 10;
                for (let i = 0; i < cellCount; i++) {
                    const cell = document.createElement('div');
                    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
                    if (i === 4) {
                        cell.textContent = 'Загрузка дополнительных записей...';
                    }
                    loadMoreRow.appendChild(cell);
                }
                
                container.appendChild(loadMoreRow);
            }
        } else {
            // Записи не найдены
            const noResultsRow = document.createElement('div');
            noResultsRow.classList.add('dictionary-content__row', 'user-element__row');
            
            const noResultsCell = document.createElement('div');
            noResultsCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-no-results');
            noResultsCell.textContent = 'Пользователи не найдены';
            
            noResultsRow.appendChild(noResultsCell);
            container.appendChild(noResultsRow);
        }
    } catch (error) {
        console.error('Error creating user rows:', error);
        // В случае ошибки показываем сообщение
        const errorRow = document.createElement('div');
        errorRow.classList.add('dictionary-content__row', 'user-element__row');
        
        const errorCell = document.createElement('div');
        errorCell.classList.add('dictionary-content__row_item', 'user-element__cell', 'user-element__cell-no-results');
        errorCell.textContent = 'Ошибка загрузки данных пользователей';
        
        errorRow.appendChild(errorCell);
        container.appendChild(errorRow);
    }
    
    return container;
} 