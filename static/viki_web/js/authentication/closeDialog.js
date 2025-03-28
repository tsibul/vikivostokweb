'use strict'

/**
 * close dialog window
 * @param e
 */
export function closeDialog(e) {
    const dialog = e.target.closest('dialog');
    dialog.close();
}