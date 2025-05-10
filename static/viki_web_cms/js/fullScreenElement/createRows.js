/**
 * @fileoverview Module for creating user rows in dictionary
 * @module userElement/createUserRows
 */

'use strict';

import {loadMoreRecords} from "./loadMoreRecords.js";
import {fetchData} from "./fetchData.js";

/**
 * Creates user rows for the dictionary display
 * @param {HTMLElement} container
 * @param {number} lastRecord - Last record number to start from
 * @param {string} searchString - Search string to filter users
 * @param {boolean} newOnly - Whether to show only new users
 * @param {function} createRow
 * @param {string} rowStyle
 * @param {string} fetchUrl
 */
export async function createRows(container, lastRecord = 0, searchString = '',
                                 newOnly = false, createRow, rowStyle, fetchUrl) {
    // Нормализация параметров
    if (searchString === null || searchString === undefined) {
        searchString = '';
    }

    const data = await fetchData(lastRecord, searchString, newOnly, fetchUrl);

    // Проверяем структуру полученных данных
    const dataList = data && data.dataList ? data.dataList : [];

    if (dataList && dataList.length > 0) {
        let counter = 1;
        dataList.forEach(item => {
            const row = document.createElement('div');
            row.classList.add('dictionary-content__row', rowStyle);
            row.dataset.id = item.id;
            createRow(row, item);
            counter++;
            if (counter === 20) {
                row.dataset.last = (lastRecord + 20).toString();
                row.addEventListener('mouseover', () => {
                    loadMoreRecords(row, container, lastRecord + 20, searchString, newOnly,
                        createRow, rowStyle, fetchUrl);
                })
            }
            container.appendChild(row);
        });
    }
}

