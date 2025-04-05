/**
 * @fileoverview Main entry point for CMS application
 * @module main
 */

'use strict';
import {createContentLeft} from './leftMenu/createContentLeft.js';
import {createFullScreenContent} from "./fullScreenElement/createFullScreenContent.js";
import {createGoodsElement} from "./goodsElement/createGoodsElement.js";
import {createCatalogueElement} from "./catalogueElement/createCatalogueElement.js";
import {createPriceElement} from "./priceElement/createPriceElement.js";
import {fetchJsonData} from "./fetchJsonData.js";
import {checkUserData} from "./authentification/checkUserData.js";
import {login} from "./authentification/login.js";

/**
 * Base URL for JSON data
 * @type {string}
 */
export const jsonUrl = './json/'

/**
 * Mapping of page types to their content creation functions
 * @type {Object<string, Function>}
 */
export const cmsPages = {
    'Goods': createGoodsElement,
    'Catalogue': createCatalogueElement,
    'PriceList': createPriceElement,
}

const checkUserUrl = jsonUrl + 'userdata';
const userData = await fetchJsonData(checkUserUrl);
localStorage.setItem('userData', JSON.stringify(userData));
const userLogged = checkUserData();
if (!userLogged) {
    const menuRight = document.querySelector('.menu__right');
    menuRight.addEventListener('click', login);
}

const menuItems = document.querySelectorAll('.menu__item');
const content = document.querySelector('.content');

menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', async (event) => {
        if (!menuItem.classList.contains('menu__item_bold')) {
            menuItem.classList.add('menu__item_bold');
            content.innerHTML = '';
            if (event.target.dataset.page === 'Standard') {
                createContentLeft(content, menuItem.dataset.content);
            } else {
                await createFullScreenContent(content, menuItem.dataset.content, event.target.dataset.page);
            }
        }
        menuItems.forEach(item => {
            item !== menuItem ? item.classList.remove('menu__item_bold') : null;

        })
    })
});