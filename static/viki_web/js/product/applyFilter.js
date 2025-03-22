'use strict'

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
            priceFilterList(priceInput.value, allItems)
    }

    combineFilters(filterIdList, printIdList, colorIdList, priceIdList, goodsIds, allGoods, itemIds, allItems);
    document.querySelector('.filter').removeAttribute('open')
}

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
            if (!colorItemTemp.includes(colorLabel.dataset.itemId)
            || !priceItemTemp.includes(colorLabel.dataset.itemId)
            ) {
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
        });
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


