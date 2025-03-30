'use strict'

import {modalDnD} from "../common/modalDnD.js";

/**
 * send new password to existing user
 * @param registerDialog
 */
export function forgotPassword(registerDialog) {
    registerDialog.showModal();
    registerDialog.querySelector('.btn__save').textContent = 'Восстановить';
    registerDialog.querySelector('.login__title').firstElementChild.textContent =
        'Восстановление пароля';
    registerDialog.querySelector('input.user-type').value = 'old';
    registerDialog.showModal();
    modalDnD(registerDialog);
}