'use strict';
import {createContentLeft} from './leftMenu/createContentLeft.js';

export const jsonUrl = './json/'

const menuItems = document.querySelectorAll('.menu__item');
const contentLeft = document.querySelector('.content__left');
const contentRight = document.querySelector('.content__right');

menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', (event) => {
        if (!menuItem.classList.contains('menu__item_bold')) {
            menuItem.classList.add('menu__item_bold')
            contentLeft.innerHTML = '';
            contentRight.innerHTML = '';
            createContentLeft(contentLeft, menuItem.dataset.content)
        }
        menuItems.forEach(item => {
            item !== menuItem ? item.classList.remove('menu__item_bold') : null;

        })
    })
});