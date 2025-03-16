'use strict'

export function selectItemColor(e) {
    const labelCheck = this.querySelector('.color-label__check');
    if (labelCheck.style.display === '') {
        const newItemId = this.getAttribute('data-item-id');
        const currentItem = this.closest('.product-hor__frame');
        currentItem.querySelector(`#${this.htmlFor}`).checked = false;
        const newItem = this.closest('.product-hor').querySelector(`div[data-id="${newItemId}"]`);
        const img = newItem.querySelector('img');
        if (img.complete) {
            newItem.classList.remove('item-hidden');
            setTimeout(() =>{newItem.classList.remove('item-opaque')}, 1);
            currentItem.classList.add('item-opaque');
            setTimeout(() =>{currentItem.classList.add('item-hidden')}, 600);
        } else {
            img.removeAttribute('loading');
            img.addEventListener('load', () => {
            newItem.classList.remove('item-hidden');
            setTimeout(() =>{newItem.classList.remove('item-opaque')}, 1);
            currentItem.classList.add('item-opaque');
            setTimeout(() =>{currentItem.classList.add('item-hidden')}, 400);
            });
        }
        const colorCode = this.dataset.hex;
        const newLabel = newItem.querySelector(`label[data-hex="${colorCode}"]`);
        newLabel.querySelector('.color-label__check').style.display = 'block';
        const newCheck = newItem.querySelector(`#${newLabel.htmlFor}`);
        newCheck.checked = true;
    }
}