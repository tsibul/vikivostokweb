/**
 * @fileoverview Module for closing authentication dialogs
 * @module authentication/closeDialog
 */

'use strict'

import {dialogClear} from "./dialogClear.js";

/**
 * Closes a dialog window and clears its form inputs
 * @param {Event} e - Click event on the close button
 */
export function closeDialog(e) {
    const dialog = e.target.closest('dialog');
    dialogClear(dialog);
    dialog.close();
}