'use strict'

import {getCSRFToken} from "../getCSRFToken.js";

export async function logInFunc(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const response = await fetch('/log-in/', {
        method: 'POST',
        body: formData,
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
    });
    const data = await response.json();
    if (data.status === "ok") {
        window.history.replaceState(null, "", window.location.pathname);
        window.location.reload();
    } else {
        const alert = form.querySelector('.alert');
        alert.textContent = 'ошибка ввода почты или пароля';
    }

}