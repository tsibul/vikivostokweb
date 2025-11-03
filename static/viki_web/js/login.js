/**
 * @fileoverview Main authentication module that handles user login, registration, and logout functionality
 * @module authentication
 */

'use strict';

import {closeDialog} from "./authentication/closeDialog.js";
import {logOut} from "./authentication/logOut.js";
import {logInFunc} from "./authentication/logInFunc.js";
import {register} from "./authentication/register.js";
import {modalDnD} from "./common/modalDnD.js";
import {forgotPassword} from "./authentication/forgotPassword.js";

/**
 * Login menu button element
 * @type {HTMLElement}
 */
const menuLogIn = document.querySelector('nav.menu__cabinet .log-login');

/**
 * Logout menu button element
 * @type {HTMLElement}
 */
const menuLogOut = document.querySelector('nav.menu__cabinet .log-logout');

/**
 * Register menu button element
 * @type {HTMLElement}
 */
const menuRegister = document.querySelector('nav.menu__cabinet .log-register');

/**
 * Logout confirmation dialog element
 * @type {HTMLElement}
 */
const logOutDialog = document.querySelector('dialog.log-logout');

/**
 * Logout confirmation button element
 * @type {HTMLElement}
 */
const logOutBtn = logOutDialog.querySelector('.btn__save');

/**
 * Registration dialog element
 * @type {HTMLElement}
 */
const registerDialog = document.querySelector('dialog.log-register');

/**
 * Registration form element
 * @type {HTMLFormElement}
 */
const registerForm = registerDialog.querySelector('form');

/**
 * Login dialog element
 * @type {HTMLElement}
 */
const logInDialog = document.querySelector('dialog.log-login');

/**
 * Login form element
 * @type {HTMLFormElement}
 */
const logInForm = logInDialog.querySelector('form');

/**
 * Temporary login dialog element
 * @type {HTMLElement}
 */
const logInTempDialog = document.querySelector('dialog.log-temporary');

/**
 * Temporary login form element
 * @type {HTMLFormElement}
 */
const logInTempForm = logInTempDialog.querySelector('form');

// const changePasswordDialog = document.querySelector('dialog.log-change-pass');
// const changePasswordForm = changePasswordDialog.querySelector('form');

/**
 * Collection of all cancel buttons in dialogs
 * @type {NodeList}
 */
const cancelBtn = document.querySelectorAll('dialog .btn__cancel');

/**
 * Collection of all close (X) buttons in dialog titles
 * @type {Array<HTMLElement>}
 */
const cancelTimes = [...document.querySelectorAll('dialog .login__title')]
    .map(el => el.lastElementChild);

/**
 * Collection of all input elements in dialogs
 * @type {NodeList}
 */
const allDialogInputs = document.querySelectorAll('dialog .login__input');

if (menuLogIn) {
    menuLogIn.addEventListener('click', () => {
        logInDialog.showModal()
        modalDnD(logInDialog);
    });
}

if (menuLogOut) {
    menuLogOut.addEventListener('click', () => {
        logOutDialog.showModal();
        modalDnD(logOutDialog);
        logOutBtn.focus();
    });
}

if (menuRegister) {
    menuRegister.addEventListener('click', () => {
        registerDialog.showModal();
        registerDialog.querySelector('.btn__save').textContent = 'Зарегистрироваться';
        registerDialog.querySelector('.login__title').firstElementChild.textContent = 'Регистрация';
        registerDialog.querySelector('input.user-type').value = 'new';
        modalDnD(registerDialog);
    });
}

cancelTimes.forEach(cancelTime => {
    cancelTime.addEventListener('click', closeDialog);
});

cancelBtn.forEach((btn) => {
    btn.addEventListener('click', closeDialog);
});

logOutBtn.addEventListener('click', await logOut);

logInForm.addEventListener('submit', async (e) => {
    await logInFunc(e, '/log-in/');
});

logInForm.querySelector('.login__btn_forget')
    .addEventListener('click', async (e) => {
        logInDialog.close();
        forgotPassword(registerDialog);
    })

logInTempForm.addEventListener('submit', async (e) => {
    await logInFunc(e, '/log-temp/');
});

// changePasswordForm.addEventListener('submit', await changePassword);

registerForm.addEventListener('submit', async (e) => {
    await register(e)
});

[...allDialogInputs].forEach(input => {
    input.addEventListener('mousedown', e => {
        e.target.closest('form').querySelector('.alert').textContent = '';
    });
});