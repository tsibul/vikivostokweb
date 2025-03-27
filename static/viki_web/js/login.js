'use strict';

import {closeDialog} from "./authentication/closeDialog.js";
import {logOut} from "./authentication/logOut.js";
import {logInFunc} from "./authentication/logInFunc.js";
import {changePassword} from "./authentication/changePassword.js";
import {register} from "./authentication/register.js";

const menuLogIn = document.querySelector('nav.menu__cabinet .log-login');
const menuLogOut = document.querySelector('nav.menu__cabinet .log-logout');
const menuRegister = document.querySelector('nav.menu__cabinet .log-register');
const logOutDialog = document.querySelector('dialog.log-logout');
const logOutBtn = logOutDialog.querySelector('.btn__save');
const registerDialog = document.querySelector('dialog.log-register');
const registerBtn = registerDialog.querySelector('.btn__save');
const logInDialog = document.querySelector('dialog.log-login');
const logInBtn = logInDialog.querySelector('.btn__save');
const changePasswordDialog = document.querySelector('dialog.log-change-pass');
const changePasswordBtn = changePasswordDialog.querySelector('.btn__save');
const cancelBtn = document.querySelectorAll('dialog .btn__cancel');
const cancelTimes = [...document.querySelectorAll('dialog .login__title')]
    .map(el => el.lastElementChild);

if (menuLogIn) {
    menuLogIn.addEventListener('click', () => {
        logInDialog.showModal()
    });
}

if (menuLogOut) {
    menuLogOut.addEventListener('click', () => {
        logOutDialog.showModal();
        logOutBtn.focus();
    });
}

if (menuRegister) {
    menuRegister.addEventListener('click', () => {
        registerDialog.showModal();
    });
}


cancelTimes.forEach(cancelTime => {
    cancelTime.addEventListener('click', closeDialog);
});

cancelBtn.forEach((btn) => {
    btn.addEventListener('click', closeDialog);
});

logOutBtn.addEventListener('click', await logOut);

logInBtn.addEventListener('submit', await logInFunc);

changePasswordBtn.addEventListener('submit', await changePassword);

registerBtn.addEventListener('submit', await register);
