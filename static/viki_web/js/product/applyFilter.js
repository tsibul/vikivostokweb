'use strict'

import {productListeners} from "./productListeners.js";

export async function applyFilter(e) {
    e.preventDefault()
    const postUrl = `./${e.target.dataset.url}`;

    const allGoods = document.querySelectorAll('.product-hor');
    const goodsIds = [...allGoods].reduce((acc, item) => {
        acc[item.getAttribute('data-id')] = item;
        return acc;
    }, {});

    const allItems = document.querySelectorAll('.product-hor__frame');
    const itemIds = [...allItems].reduce((acc, item) => {
        acc[item.getAttribute('data-id')] = item;
        return acc;
    }, {});

    let filterIdList, printIdList, colorIdList, priceIdList;
    const filterDetails = document.querySelector(`.filter`);
    const filterInputs = checkedFilter(
        filterDetails
            .querySelectorAll(`.filter__content_data_filter input[type="checkbox"]`)
    );
    if (filterInputs.length > 0) {
        filterIdList =
            await goodsFilterList(inputsDataId(filterInputs), Object.keys(goodsIds), postUrl, 'filter')
    }
    const printInputs = checkedFilter(
        filterDetails
            .querySelectorAll(`.filter__content_data_print input[type="checkbox"]`)
    );
    if (printInputs.length > 0) {
        printIdList =
            await goodsFilterList(inputsDataId(printInputs), Object.keys(goodsIds), postUrl, 'print')
    }
    const colorInputs = checkedFilter(
        filterDetails
            .querySelectorAll(`.filter__content_data_color input[type="checkbox"]`)
    );
    if (colorInputs.length > 0) {
        colorIdList =
            await goodsFilterList(inputsDataId(colorInputs), Object.keys(itemIds), postUrl, 'color')
    }
    const priceInput = filterDetails.querySelector(`.filter .input-range`);
    if (priceInput.value <= priceInput.max - 0.1) {
        priceIdList =
            await priceFilterList(priceInput.value, Object.keys(goodsIds), postUrl, 'price')
    }

    combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods, itemIds, allItems);
    document.querySelector('.filter').removeAttribute('open')
}

function combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods, itemIds, allItems) {

    let filterTemp, printTemp, colorTemp, colorItemTemp
    const filteredGoods = [];
    const filteredItems = []
    filterIdList ? filterTemp = filterIdList : filterTemp = Object.keys(goodsIds);
    printTemp = printIdList ? printIdList : Object.keys(goodsIds);
    colorTemp = colorIdList ? colorIdList['goods'] : Object.keys(goodsIds);
    colorItemTemp = colorIdList && colorIdList['item'] ? colorIdList['item'] : Object.keys(goodsIds);
    Object.keys(goodsIds).forEach(goodsKey => {
        if (!filterTemp.includes(goodsKey) ||
            !printTemp.includes(goodsKey) ||
            !colorTemp.includes(goodsKey)
        ) {
            goodsIds[goodsKey].setAttribute('style', 'display:none');
        } else {
            goodsIds[goodsKey].removeAttribute('style');
            filteredGoods.push(goodsIds[goodsKey]);
        }
    });
    if (colorIdList) {
        Object.keys(itemIds).forEach(itemKey => {
            if (!colorItemTemp.includes(itemKey)) {
                itemIds[itemKey].setAttribute('style', 'display:none');
            } else {
                itemIds[itemKey].removeAttribute('style');
                filteredItems.push(itemIds[itemKey]);
            }
        });
        const allColors = document.querySelectorAll(`.products .color-label`);
        [...allColors].forEach(colorLabel => {
            colorLabel.removeAttribute('style');
            if (!colorItemTemp.includes(colorLabel.dataset.itemId)) {
                colorLabel.setAttribute('style', 'display:none');
            }
        });
        filteredGoods.forEach(good => {
            const insideItems = good.querySelectorAll(`.product-hor__frame`);
            const filterInsideItems = [...insideItems].filter(insideItem => filteredItems.includes(insideItem));
            const insideIdList = [...filterInsideItems].map(item => parseInt(item.dataset.id));
            [...filterInsideItems].forEach((item, index) => {
                item.querySelector(`.chevron-next`).dataset.list = JSON.stringify(insideIdList);
                if (index === 0) {
                    item.classList.remove('item-hidden', 'item-opaque');
                } else {
                    item.classList.add('item-hidden', 'item-opaque');
                }
            });
        })
    }

}

function checkedFilter(inputs) {
    return [...inputs].filter(filterInput => filterInput.checked);
}

function inputsDataId(inputs) {
    return [...inputs].map(item => item.getAttribute('data-id'));
}

async function goodsFilterList(filterInputs, goodsIds, postUrl, filterType) {
    const url = postUrl + '/' + filterType;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'goods_id': goodsIds,
            'filter_id': filterInputs,
        }),
    });
    const data = await response.json();
    return data['idList'];
}

async function priceFilterList(priceLimit, goodsIds, postUrl) {
    const itemFrame = document.querySelectorAll('.product-hor__frame');

}


// export async function applyFilter(e) {
//     const filterDetails = document.querySelector(`.filter`);
//     const filterInputs = filterDetails
//         .querySelectorAll(`.filter__content_data_filter input[type="checkbox"]`);
//     const printInputs = filterDetails
//         .querySelectorAll(`.filter__content_data_print input[type="checkbox"]`);
//     const colorInputs = filterDetails
//         .querySelectorAll(`.filter__content_data_color input[type="checkbox"]`);
//     const priceInput = filterDetails.querySelector(`.filter .input-range`);
//     if (colorInputs.length > 0 ||
//         filterInputs.length > 0 ||
//         colorInputs.length > 0 ){
//         const postData = {
//             'filter': checkedFilter(filterInputs),
//             'print_type': checkedFilter(printInputs),
//             'color': checkedFilter(colorInputs),
//             'price': priceInput.value,
//         }
//         const postUrl = `./${e.target.dataset.url}/filter`
//         const response = await fetch(postUrl, {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(postData),
//         });
//         const text = await response.text();
//         document.open();
//         document.write(text);
//         document.close();
//         await productListeners();
//     } else {
//             filterDetails.removeAttribute('open')
//     }
// }

