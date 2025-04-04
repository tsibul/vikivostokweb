/**
 * @fileoverview Module for sending form data to server endpoints
 * @module common/sendFormData
 */

'use strict'

import {getCSRFToken} from "./getCSRFToken.js";

/**
 * Sends form data to the specified URL endpoint
 * @param {string} url - Target endpoint URL
 * @param {HTMLFormElement} form - Form element containing data to send
 * @returns {Promise<Object>} Server response data
 */
export async function sendFormData(url, form) {
    const formData = new FormData(form);
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
    });
    return await response.json();
}