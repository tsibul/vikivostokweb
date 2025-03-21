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
    });

}