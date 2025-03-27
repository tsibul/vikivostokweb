'use strict'

export function closeDialog(e) {
    const dialog = e.target.closest('dialog');
    dialog.close();
}