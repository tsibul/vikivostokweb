'use strict'

export function clearFilter(e) {
    const inputs = document
        .querySelectorAll(`.filter input[type="checkbox"]`);
    const colorSelects = document
        .querySelectorAll(`.filter__content_data_color .color-label__check`);
    const filterDetails = document.querySelector(`.filter`);
    const priceRange = document.querySelector(`.filter .input-range`);
    const priceRangeValue = document.querySelector(`.filter .input-range__value`);
    inputs.forEach(input => {
        input.checked = false
    });
    colorSelects.forEach(select => {
        select.removeAttribute('style')
    });
    priceRange.value = priceRange.max;
    priceRangeValue.textContent = 'до ' + priceRange.max;
    filterDetails.removeAttribute('open')
    const allGoods = document.querySelectorAll('.product-hor');
    [...allGoods].forEach(goods => {
        goods.removeAttribute('style')
        const insideItems = goods.querySelectorAll('.product-hor__frame');
        const rndId = Math.round(Math.random() * (insideItems.length - 1));
        [...insideItems].forEach((item, index) => {
            item.removeAttribute('style');
            item.querySelector(`.chevron-next`).dataset.list =
                item.querySelector(`.chevron-next`).dataset.listInitial;
            if (insideItems.length > 1) {
                if (index === rndId) {
                    item.classList.remove('item-hidden', 'item-opaque');
                } else {
                    item.classList.add('item-hidden', 'item-opaque');
                }
            } else {
                item.classList.remove('item-hidden', 'item-opaque');
            }
        });
    });

    const allColors = document.querySelectorAll(`.products .color-label`);
    [...allColors].forEach(item => {
        item.removeAttribute('style')
    });


}