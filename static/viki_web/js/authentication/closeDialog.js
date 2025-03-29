'use strict'

import {dialogClear} from "./dialogClear.js";

/**
 * close dialog window
 * @param e
 */
export function closeDialog(e) {
    const dialog = e.target.closest('dialog');
    dialogClear(dialog);
    dialog.close();
}