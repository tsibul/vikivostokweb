/**
 * @fileoverview Module for applying product filters
 * @module product/applyFilter
 */

'use strict'

/**
 * Applies selected filters to products
 * @param {Event} e - Submit event from the filter form
 * @returns {Promise<void>}
 */
export async function applyFilter(e) {
    e.preventDefault()
    // const postUrl = `./${e.target.dataset.url}`;
    const postUrl = `/filter`;

    const allGoods = document.querySelectorAll('.product');
    const goodsIds = [...allGoods].reduce((acc, item) => {
        acc[item.getAttribute('data-id')] = item;
        return acc;
    }, {});

    const allItems = document.querySelectorAll('.product-hor__image-frame');
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
            priceFilterList(priceInput.value, allItems)
    }

    combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods, itemIds, allItems);
    document.querySelector('.filter').removeAttribute('open')
}

/**
 * Combines multiple filter results and updates product display
 * @param {Array<string>} filterIdList - List of IDs from filter filter
 * @param {Array<string>} printIdList - List of IDs from print filter
 * @param {Object} colorIdList - Object containing lists of IDs from color filter
 * @param {Object} priceIdList - Object containing lists of IDs from price filter
 * @param {Object} goodsIds - Map of product IDs to elements
 * @param {NodeList} allGoods - All product elements
 * @param {Object} itemIds - Map of item IDs to elements
 * @param {NodeList} allItems - All item elements
 */
function combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods, itemIds, allItems) {

    let filterTemp, printTemp, colorTemp, priceTemp, colorItemTemp, priceItemTemp;
    const filteredGoods = [];
    const filteredItems = []
    filterTemp = filterIdList ? filterIdList : Object.keys(goodsIds);
    printTemp = printIdList ? printIdList : Object.keys(goodsIds);
    colorTemp = colorIdList ? colorIdList['goods'] : Object.keys(goodsIds);
    colorItemTemp = colorIdList && colorIdList['item'] ? colorIdList['item'] : Object.keys(itemIds);
    priceTemp = priceIdList ? priceIdList['goods'] : Object.keys(goodsIds);
    priceItemTemp = priceIdList && priceIdList['item'] ? priceIdList['item'] : Object.keys(itemIds);
    Object.keys(goodsIds).forEach(goodsKey => {
        if (!filterTemp.includes(goodsKey)
            || !printTemp.includes(goodsKey)
            || !colorTemp.includes(goodsKey)
            || !priceTemp.includes(goodsKey)
        ) {
            goodsIds[goodsKey].setAttribute('style', 'display:none');
        } else {
            goodsIds[goodsKey].removeAttribute('style');
            filteredGoods.push(goodsIds[goodsKey]);
        }
    });
    if (colorIdList
        || priceIdList
    ) {
        Object.keys(itemIds).forEach(itemKey => {
            if (!colorItemTemp.includes(itemKey)
                || !priceItemTemp.includes(itemKey)
            ) {
                itemIds[itemKey].setAttribute('style', 'display:none');
            } else {
                itemIds[itemKey].removeAttribute('style');
                filteredItems.push(itemIds[itemKey]);
            }
        });
        const allColors = document.querySelectorAll(`.products .color-label`);
        [...allColors].forEach(colorLabel => {
            colorLabel.removeAttribute('style');
            if (!colorItemTemp.includes(colorLabel.dataset.id)
                || !priceItemTemp.includes(colorLabel.dataset.id)
            ) {
                colorLabel.setAttribute('style', 'display:none');
            }
        });
        filteredGoods.forEach(good => {
            const insideItems = good.querySelectorAll(`.product-hor__image-frame`);
            const filterInsideItems = [...insideItems].filter(insideItem => filteredItems.includes(insideItem));
            const insideIdList = [...filterInsideItems].map(item => parseInt(item.dataset.id));
            good.querySelector(`.chev-next`).dataset.list = JSON.stringify(insideIdList);
            // [...filterInsideItems].forEach((item, index) => {
            //     // item.querySelector(`.chev-next`).dataset.list = JSON.stringify(insideIdList);
            //     if (index === 0) {
            //         item.classList.remove('item-hidden', 'item-opaque');
            //     } else {
            //         item.classList.add('item-hidden', 'item-opaque');
            //     }
            // });

            const rndId = insideIdList.length > 1 ? Math.round(Math.random() * (insideIdList.length - 1)) : 0;
            const label = good.querySelector(`.color-padding label.color-label[data-id="${insideIdList[rndId]}"]`);
            label.click()
        });
    }

}

/**
 * Filters input elements to get only checked ones
 * @param {NodeList} inputs - List of input elements
 * @returns {Array<HTMLInputElement>} Array of checked input elements
 */
function checkedFilter(inputs) {
    return [...inputs].filter(filterInput => filterInput.checked);
}

/**
 * Extracts data-id attributes from input elements
 * @param {Array<HTMLInputElement>} inputs - List of input elements
 * @returns {Array<string>} Array of data-id values
 */
function inputsDataId(inputs) {
    return [...inputs].map(item => item.getAttribute('data-id'));
}

/**
 * Fetches filtered product IDs from server
 * @param {Array<string>} filterInputs - List of filter IDs
 * @param {Array<string>} goodsIds - List of product IDs
 * @param {string} postUrl - URL for the filter request
 * @param {string} filterType - Type of filter being applied
 * @returns {Promise<Array<string>>} List of filtered product IDs
 */
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

/**
 * Filters items based on price limit
 * @param {string} priceLimit - Maximum price value
 * @param {NodeList} allItems - All item elements
 * @returns {Object} Object containing lists of filtered goods and items
 */
function priceFilterList(priceLimit, allItems) {
    const goodsList = [];
    const itemList = [];
    [...allItems].forEach(item => {
        if (parseFloat(item.dataset.price) <= parseFloat(priceLimit)) {
            itemList.push(item.dataset.id);
            if (!goodsList.includes(item.dataset.goods)) {
                goodsList.push(item.dataset.goods);
            }
        }
    });
    return {
        'goods': goodsList,
        'item': itemList,
    };
}


