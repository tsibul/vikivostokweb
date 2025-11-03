/**
 * @fileoverview Module for handling user logout functionality
 * @module authentication/logOut
 */

'use strict'

import {getCSRFToken} from "../common/getCSRFToken.js";

/**
 * Logs out the current user and reloads the page
 * @param {Event} e - Click event on the logout button
 * @returns {Promise<void>}
 */
export async function logOut(e) {
    e.preventDefault();
    const response = await fetch("/log-out/", {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(),
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();

    if (data.status === "ok") {
        window.history.replaceState(null, "", window.location.pathname);
        window.location.reload();
    }
}