'use strict'

export function applyConstructor(modal, goodsItem, currentFrame) {
    // e.preventDefault()
    const form = modal.querySelector('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const detailsNumber = parseInt(goodsItem.dataset.articleLength);
    const articleLength = Object.keys(data).includes('option')
        ? Object.keys(data).length - 1 : Object.keys(data).length;
    if (articleLength === detailsNumber) {
        let article = goodsItem.dataset.goodsArticle;
        for (let i = 1; i <= articleLength; i++) {
            article = article + '.' + data[i];
        }
        if (data['option']) {
            article = article + '.' + data['option'];
        }
        const newItem = goodsItem.querySelector(`div.product-frame[data-article="${article}"]`);
        if (newItem) {
            currentFrame.classList.add('item-hidden', 'item-opaque');
            newItem.classList.remove('item-hidden', 'item-opaque');
            modal.remove()
        } else {
            modal.querySelector('.simple-constructor__alert')
                .textContent = 'Для заказа этого товара обратитесь к менеджеру. Цена: '
                + currentFrame.dataset.price;
        }
    } else {
        modal.querySelector('.simple-constructor__alert')
            .textContent = 'Отметьте все элементы';
    }

    console.log();
}