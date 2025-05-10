'use strict';

import {createRows} from "./createRows.js";
import {createPageHeader} from "./createPageHeader.js";

/**
 * crate content for full screen pages
 * @param {string} cssName
 * @param {Array} columns
 * @param {string} headerStyle
 * @param {function} getData
 * @param {function} createRow
 * @returns {Promise<HTMLDivElement>}
 */
export async function createPageContent (cssName, columns, headerStyle,
                                         getData, createRow) {
    const container = document.createElement('div');
    container.classList.add(cssName);

    const header = createPageHeader(columns, headerStyle);
    container.appendChild(header);

    const rows = document.createElement('div');
    rows.classList.add(cssName + '__rows');
    await createRows(rows, 0, '', false, getData, createRow, headerStyle);
    container.appendChild(rows);

    return container;

}
