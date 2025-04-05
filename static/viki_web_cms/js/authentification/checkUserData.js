/**
 * @fileoverview Module for checking user authentication status
 * @module authentification/checkUserData
 */

'use strict'

/**
 * Checks if user is authenticated and updates UI accordingly
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export function checkUserData(){
    const userDataElement = document.getElementById('userData');
    const userData = JSON.parse(localStorage.getItem('userData'));
    userDataElement.textContent = userData.username;
    return userData.username !== 'Авторизуйтесь';
}