'use strict';

import {createRows} from "./createRows.js";
import {createPageHeader} from "./createPageHeader.js";

/**
 * crate content for full screen pages
 * @param {string} cssName
 * @param {Array} columns
 * @param {string} headerStyle
 * @param {function} createRow
 * @param {string} fetchUrl
 * @returns {Promise<HTMLDivElement>}
 */
export async function createPageContent (cssName, columns, headerStyle,
                                         createRow, fetchUrl) {
    const container = document.createElement('div');
    container.classList.add(cssName);

    const header = createPageHeader(columns, headerStyle);
    container.appendChild(header);

    const rows = document.createElement('div');
    rows.classList.add('dictionary-content__rows');
    await createRows(rows, 0, '', true, createRow, headerStyle, fetchUrl);
    container.appendChild(rows);

    return container;

}
