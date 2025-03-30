'use strict'

import {getCSRFToken} from "./getCSRFToken.js";

/**
 * send form data from log modal to desired url
 * @param url
 * @param form
 * @returns {Promise<any>}
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