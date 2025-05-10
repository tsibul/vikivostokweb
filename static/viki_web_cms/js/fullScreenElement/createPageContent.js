'use strict';

/**
 * crate content for full screen pages
 * @param {string} cssName
 * @param {function} createHeader
 * @param {function(HTMLElement, number, string, boolean): Promise<Array<HTMLElement>>} createRows
 * @param {Array} columns
 * @param {string} headerStyle
 * @returns {Promise<HTMLDivElement>}
 */
export async function createPageContent (cssName, createHeader, createRows, columns, headerStyle) {
    const container = document.createElement('div');
    container.classList.add(cssName);

    const header = createHeader(columns, headerStyle);
    container.appendChild(header);

    const rows = document.createElement('div');
    rows.classList.add(cssName + '__rows');
    await createRows(rows, 0, '', false);
    container.appendChild(rows);

    return container;

}
