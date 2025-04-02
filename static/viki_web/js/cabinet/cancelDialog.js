'use strict';

export function cancelDialog(e, dialogForm) {
    const dialog = dialogForm.closest('dialog');
    const alert = dialog.querySelector('.alert');
    if (alert) {
        alert.textContent = null;
    }
    dialog.close()
}