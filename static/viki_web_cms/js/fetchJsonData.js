/**
 * @fileoverview Module for fetching JSON data from server
 * @module fetchJsonData
 */

'use strict';

import {getCSRFToken} from "./getCSRFToken.js";

/**
 * Fetches JSON data from specified URL with CSRF token
 * @param {string} jsonUrl - URL to fetch JSON data from
 * @returns {Promise<Object>} Promise that resolves to parsed JSON data
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