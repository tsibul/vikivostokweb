'use strict'

import {getCSRFToken} from "../getCSRFToken.js";

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