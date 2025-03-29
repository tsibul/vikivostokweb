'use strict'

/**
 * gt csrf token from cookie
 * @returns {*}
 */
export function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];
}