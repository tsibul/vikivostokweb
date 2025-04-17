/**
 * @fileoverview Module for applying constructor changes to the product
 * @module constructor/applyConstructor
 */

'use strict'

/**
 * Applies selected constructor options to the product
 * @param {HTMLElement} modal - Constructor dialog element
 * @param {HTMLElement} goodsItem - Product container element
 * @param {HTMLElement} currentFrame - Current product frame element
 */
export function applyConstructor(modal, goodsItem, currentFrame) {
    const form = modal.querySelector('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const detailsNumber = parseInt(goodsItem.getAttribute('data-article-length'));
    const articleLength = Object.keys(data).includes('option')
        ? Object.keys(data).length - 1 : Object.keys(data).length;
    
    if (articleLength === detailsNumber) {
        const goodsArticle = goodsItem.getAttribute('data-goods-article');
        let article = goodsArticle;
        
        for (let i = 1; i <= articleLength; i++) {
            article = article + '.' + data[i];
        }
        if (data['option']) {
            article = article + '.' + data['option'];
        }
        
        // Find the currently visible image frame
        const visibleImageFrame = goodsItem.querySelector('.product-hor__image-frame:not(.item-hidden)') || 
                                 goodsItem.querySelector('.product-sqr__image-frame:not(.item-hidden)');
        
        // Find any image frame that has the matching article
        const newItem = goodsItem.querySelector(`.product-hor__image-frame[data-article="${article}"]`) || 
                       goodsItem.querySelector(`.product-sqr__image-frame[data-article="${article}"]`);
        
        if (newItem) {
            // Hide the currently visible frame
            if (visibleImageFrame) {
                visibleImageFrame.classList.add('item-hidden', 'item-opaque');
            }
            
            // Show the new item
            newItem.classList.remove('item-hidden', 'item-opaque');
            modal.remove();
        } else {
            // Get price from the visible frame
            const price = visibleImageFrame ? visibleImageFrame.dataset.price : '';
            modal.querySelector('.simple-constructor__alert')
                .textContent = 'Для заказа этого товара обратитесь к менеджеру. Цена: ' + price;
        }
    } else {
        modal.querySelector('.simple-constructor__alert')
            .textContent = 'Отметьте все элементы';
    }
}