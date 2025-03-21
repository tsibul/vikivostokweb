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
            await goodsFilterList(inputsDataId(colorInputs), Object.keys(goodsIds), postUrl, 'color')
    }
    const priceInput = filterDetails.querySelector(`.filter .input-range`);
    if (priceInput.value <= priceInput.max - 0.1) {
        priceIdList =
            await priceFilterList(priceInput.value, Object.keys(goodsIds), postUrl, 'price')
    }

    combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods);
    document.querySelector('.filter').removeAttribute('open')
}

function combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods) {
    let filterTemp, printTemp = null;
    filterIdList ? filterTemp = filterIdList : filterTemp = Object.keys(goodsIds);
    printIdList ? printTemp = printIdList : printTemp = Object.keys(goodsIds);
    // if (filterIdList && printIdList) {
    //     const filterSet = new Set(filterIdList);
    //     goodsIdList = printIdList.filter(item => filterSet.has(item));
    // } else if (filterIdList) {
    //     goodsIdList = filterIdList;
    // } else if (printIdList) {
    //     goodsIdList = printIdList;
    // }
    // if (goodsIdList) {
        [...allGoods].forEach(goods => {
            goods.removeAttribute('style');
        });
        Object.keys(goodsIds).forEach(goodsKey => {
            if (!filterTemp.includes(goodsKey) || !printTemp.includes(goodsKey)) {
                goodsIds[goodsKey].setAttribute('style', 'display:none');
            }
        });
    // }
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

