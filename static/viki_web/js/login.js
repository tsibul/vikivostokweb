'use strict';

import {closeDialog} from "./authentication/closeDialog.js";
import {logOut} from "./authentication/logOut.js";
import {logInFunc} from "./authentication/logInFunc.js";
import {changePassword} from "./authentication/changePassword.js";
import {register} from "./authentication/register.js";
import {modalDnD} from "./modalDnD.js";

const menuLogIn = document.querySelector('nav.menu__cabinet .log-login');
const menuLogOut = document.querySelector('nav.menu__cabinet .log-logout');
const menuRegister = document.querySelector('nav.menu__cabinet .log-register');
const logOutDialog = document.querySelector('dialog.log-logout');
const logOutBtn = logOutDialog.querySelector('.btn__save');
const registerDialog = document.querySelector('dialog.log-register');
const registerForm = registerDialog.querySelector('form');
const logInDialog = document.querySelector('dialog.log-login');
const logInForm = logInDialog.querySelector('form');
const changePasswordDialog = document.querySelector('dialog.log-change-pass');
const changePasswordForm = changePasswordDialog.querySelector('form');
const cancelBtn = document.querySelectorAll('dialog .btn__cancel');
const cancelTimes = [...document.querySelectorAll('dialog .login__title')]
    .map(el => el.lastElementChild);
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

logInForm.addEventListener('submit', await logInFunc);

changePasswordForm.addEventListener('submit', await changePassword);

registerForm.addEventListener('submit', await register);

[...allDialogInputs].forEach(input => {
    input.addEventListener('mousedown', e => {
        e.target.closest('form').querySelector('.alert').textContent = '';
    });
});