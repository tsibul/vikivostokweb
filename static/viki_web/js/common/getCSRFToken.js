/**
 * @fileoverview Module for retrieving CSRF token from cookies
 * @module common/getCSRFToken
 */

'use strict'

/**
 * Retrieves CSRF token from browser cookies
 * @returns {string|null} CSRF token value or null if not found
 */
export function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];
}