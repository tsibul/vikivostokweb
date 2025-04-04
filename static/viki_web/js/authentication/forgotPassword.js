/**
 * @fileoverview Module for handling password recovery functionality
 * @module authentication/forgotPassword
 */

'use strict'

import {modalDnD} from "../common/modalDnD.js";

/**
 * Opens password recovery dialog and sets up its UI
 * @param {HTMLElement} registerDialog - Registration dialog element to be reused for password recovery
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