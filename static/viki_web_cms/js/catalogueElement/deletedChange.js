'use strict'

/**
 *
 * @param e
 */
export function deletedChange (e) {
    const form = e.target.closest('form');
    if (form.querySelector('textarea').value) {
        const btnSave = form.querySelector('.btn__save');
        btnSave.disabled = false;
        btnSave.classList.remove('btn__disabled');
        const btnCancel = form.querySelector('.btn__cancel');
        btnCancel.disabled = false;
        btnCancel.classList.remove('btn__disabled');
    }
}