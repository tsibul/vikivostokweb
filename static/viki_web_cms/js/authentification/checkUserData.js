'use strict'

export function checkUserData(){
    const userDataElement = document.getElementById('userData');
    const userData = JSON.parse(localStorage.getItem('userData'));
    userDataElement.textContent = userData.username;
    return userData.username !== 'Авторизуйтесь';
}