'use strict';

import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";
import {createFileRow} from "./createFileRows.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createFilesElement(className) {
    const headerStyle = 'files-element__header';
    setupHeaderHandlers(createFileRow, headerStyle, '/cms/json/unused_files');
    const columns = [
        {title: 'справочник'},
        {title: 'файл'},
        {title: 'путь'},
        {title: 'файлов'},
        {title: ''},
    ];
    document.querySelector('.dictionary-frame__header_right').innerHTML = '';
    return await createPageContent('files-content', columns, headerStyle,
        createFileRow, '/cms/json/unused_files');
}




