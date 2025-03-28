'use strict'

import {sendFormData} from "./sendFormData.js";

/**
 * log in user
 * @param e
 * @param url
 * @returns {Promise<void>}
 */
export async function logInFunc(e, url) {
    e.preventDefault();
    const form = e.target;
    const data = await sendFormData(url, form)
    if (data.status === "ok") {
        window.history.replaceState(null, "", window.location.pathname);
        window.location.reload();
    } else {
        const alert = form.querySelector('.alert');
        alert.textContent = data.message;
    }

}