/**
 * @fileoverview Module for retrieving CSRF token from cookies
 * @module getCSRFToken
 */

'use strict'

/**
 * Retrieves CSRF token from document cookies
 * @returns {string|undefined} CSRF token value or undefined if not found
 */
export function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];
}