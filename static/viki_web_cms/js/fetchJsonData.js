'use strict';

import {getCSRFToken} from "./getCSRFToken.js";

/**
 * fetch data from json
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