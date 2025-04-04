/**
 * @fileoverview Module for fetching JSON data from server endpoints
 * @module common/fetchJsonData
 */

'use strict';

import {getCSRFToken} from "./getCSRFToken.js";

/**
 * Fetches JSON data from the specified URL endpoint
 * @param {string} jsonUrl - URL endpoint to fetch data from
 * @returns {Promise<Object>} Parsed JSON response data
 */
export function fetchJsonData(jsonUrl) {
    return fetch(jsonUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        }
    })
        .then(response => response.json());
}