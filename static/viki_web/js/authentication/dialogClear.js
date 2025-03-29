'use strict'

export function dialogClear(dialog) {
    dialog.querySelectorAll('input').forEach(input => {
        input.value = null;
    });
}