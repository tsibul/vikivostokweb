'use strict';

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";

/**
 * get fields structure for the dictionaries
 * @param className
 * @returns {Promise<*>}
 */
export async function getFieldStructure(className) {
    const url = jsonUrl + 'field_names/' + className;
    return await fetchJsonData(url);
}