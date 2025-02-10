'use strict';
import {createContentLeft} from './leftMenu/createContentLeft.js';

export const jsonUrl = './json/'

const menuItems = document.querySelectorAll('.menu__item');
const content = document.querySelector('.content');

menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', (event) => {
        if (!menuItem.classList.contains('menu__item_bold')) {
            menuItem.classList.add('menu__item_bold')
            content.innerHTML = '';
            if (event.target.dataset.page === 'Standard') {
                createContentLeft(content, menuItem.dataset.content)
            } else {

            }
        }
        menuItems.forEach(item => {
            item !== menuItem ? item.classList.remove('menu__item_bold') : null;

        })
    })
});