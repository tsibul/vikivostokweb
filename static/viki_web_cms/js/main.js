'use strict';
import {createContentLeft} from './leftMenu/createContentLeft.js';
import {createFullScreenContent} from "./fullScreenElement/createFullScreenContent.js";
import {createGoodsElement} from "./goodsElement/createGoodsElement.js";
import {createCatalogueElement} from "./catalogueElement/createCatalogueElement.js";
import {createPriceElement} from "./priceElement/createGoodsElement.js";

export const jsonUrl = './json/'
export const cmsPages = {
    'Goods': createGoodsElement,
    'Catalogue': createCatalogueElement,
    'PriceList': createPriceElement,
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