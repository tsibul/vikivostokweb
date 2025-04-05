/**
 * @fileoverview Module for handling user authentication
 * @module authentification/login
 */

'use strict';

import {createModalHeader} from "../dictionaryElement/createInput/createModalHeader.js";
import {modalDnD} from "../modalFunction/modalDnD.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {closeModal} from "../modalFunction/closeModal.js";
import {checkUserData} from "./checkUserData.js";
import {getCSRFToken} from "../getCSRFToken.js";

/**
 * Creates and displays login modal window
 * @returns {Promise<void>}
 */
export async function login() {
    const loginWindow = document.createElement('dialog');
    loginWindow.classList.add('login-cms');
    const loginHeader = createModalHeader(loginWindow, 'Вход', 0);
    loginHeader.firstElementChild.textContent = 'Вход';
    loginWindow.appendChild(loginHeader);
    const loginInput = document.createElement('input');
    loginInput.type = 'text';
    loginInput.classList.add('login-cms__input');
    loginWindow.appendChild(loginInput);
    const passInput = document.createElement('input')
    passInput.type = 'password';
    passInput.classList.add('login-cms__input');
    loginWindow.appendChild(passInput);
    const service = document.querySelector('.service');
    service.appendChild(loginWindow);
    const btnBlock = document.createElement('div');
    btnBlock.classList.add('login-cms__btn-block');
    const btnCancel = createCancelButton('Закрыть');
    btnCancel.addEventListener('click', (e) => {
        closeModal(loginWindow);
    });
    btnBlock.appendChild(btnCancel);
    const btnSave = createSaveButton('Войти')
    btnSave.addEventListener('click', (e) => {
        sendLogin(e, loginInput.value, passInput.value, loginWindow);
    })
    btnBlock.appendChild(btnSave);
    loginWindow.appendChild(btnBlock);
    loginWindow.showModal();
    modalDnD(loginWindow);

    const menuRight = document.querySelector('.menu-right');

}

/**
 * Sends login request to server
 * @param {Event} e - Event object from the login button click
 * @param {string} log - Username
 * @param {string} pass - Password
 * @param {HTMLDialogElement} modal - Login modal window
 * @returns {Promise<void>}
 */
async function sendLogin(e, log, pass, modal) {
    e.preventDefault();
    await fetch('./user_login', {
        method: 'POST',
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
            'username': log,
            'password': pass,
        })
    }).then(res => res.json())
        .then(data => {
            localStorage.setItem('userData', JSON.stringify(data));
            const userLogged = checkUserData();
            const menuRight = document.querySelector('.menu__right');
            if (!userLogged) {
                menuRight.addEventListener('click', login);
            } else {
                menuRight.removeEventListener('click', login);
            }
            closeModal(modal);
        })
}