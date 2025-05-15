'use strict';

import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {editBranding, editDelivery, editItem, editOrder} from "./editOrder.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createRows} from "../fullScreenElement/createRows.js";
import {getCSRFToken} from "../getCSRFToken.js";

const emptyIcon = `<i class="fa-regular fa-circle"></i>`;
const fullIcon = `<i class="fa-solid fa-check"></i>`;


/**
 *
 * @param {HTMLElement} oldRow
 * @param {Object} order
 */
export function createOrderRow(oldRow, order) {
    const closedOrder = order.state_id === 9 || order.state_id === 10;
    const details = document.createElement('details');
    details.classList.add('order-element');
    const row = document.createElement('summary');
    [...oldRow.attributes].forEach(attr => {
        row.setAttribute(attr.name, attr.value);
    });
    oldRow.classList.remove(...oldRow.classList);
    oldRow.appendChild(details)
    details.appendChild(row);
    let tmpField, tmpBtn, show, tmpList;
    tmpField = createTextField(order.order_no);
    row.appendChild(tmpField);
    tmpField = createTextField(order.order_date);
    row.appendChild(tmpField);
    tmpField = createTextField(order.our_company);
    row.appendChild(tmpField);
    tmpField = createTextField(order.company);
    row.appendChild(tmpField);
    tmpField = createTextField(parseFloat(order.total_amount).toLocaleString('ru-RU',
        {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    tmpField.dataset.name = 'total_amount'
    tmpField.classList.add('align-right')
    row.appendChild(tmpField);
    tmpField = createTextField(order.state);
    tmpField.dataset.id = order.state_id;
    tmpField.dataset.name = 'state';
    row.appendChild(tmpField);
    tmpField = createTextField(order.manager);
    tmpField.dataset.id = order.manager_id;
    tmpField.dataset.mail = order.manager_mail;
    row.appendChild(tmpField);
    tmpField = createTextField(order.responsible);
    tmpField.dataset.id = order.responsible_id
    tmpField.dataset.name = 'user_responsible';
    row.appendChild(tmpField);
    tmpField = createTextField(order.days_to_deliver);
    tmpField.dataset.name = 'days_to_deliver';
    row.appendChild(tmpField);
    tmpField = createTextField(order.delivery_date);
    tmpField.dataset.name = 'delivery_date';
    row.appendChild(tmpField);

    tmpField = document.createElement('div');
    tmpField.classList.add('file-dropdown');
    tmpBtn = document.createElement('button');
    tmpBtn.classList.add('btn');
    show = order.branding;
    tmpBtn.insertAdjacentHTML("afterbegin", show ? fullIcon : emptyIcon);
    tmpField.appendChild(tmpBtn);
    tmpList = createFileList(show, closedOrder, 'макет', order);
    tmpField.appendChild(tmpList);
    row.appendChild(tmpField);


    tmpField = document.createElement('div');
    tmpField.classList.add('file-dropdown');
    tmpBtn = document.createElement('button');
    tmpBtn.classList.add('btn');
    show = order.invoice;
    tmpBtn.insertAdjacentHTML("afterbegin", show ? fullIcon : emptyIcon);
    tmpField.appendChild(tmpBtn);
    tmpList = createFileList(show, closedOrder, 'счет', order);
    tmpField.appendChild(tmpList);
    row.appendChild(tmpField);

    tmpField = document.createElement('div');
    tmpField.classList.add('file-dropdown');
    tmpBtn = document.createElement('button');
    tmpBtn.classList.add('btn');
    show = order.delivery;
    tmpBtn.insertAdjacentHTML("afterbegin", show ? fullIcon : emptyIcon);
    tmpField.appendChild(tmpBtn);
    tmpList = createFileList(show, closedOrder, 'накладную', order);
    tmpField.appendChild(tmpList);
    row.appendChild(tmpField);

    tmpField = createTextField(order.state_changed_at);
    row.appendChild(tmpField);
    if (!closedOrder) {
        const button = createSaveButton('Изм');
        button.dataset.order = order.order_no;
        button.dataset.id = order.id;
        button.addEventListener('click', async (e) => {
            await editOrder(e, row);
        });
        row.appendChild(button);
    } else {
        const button = createCancelButton('Дубль');
        button.dataset.order = order.order_no;
        button.dataset.id = order.id;
        button.addEventListener('click', async (e) => {
            await repeatOrder(e, order.id);
        });
        row.appendChild(button);
    }
    tmpField = document.createElement('div');
    tmpField.classList.add('order-element__toggle');
    row.appendChild(tmpField);
    order.items.forEach(item => {
        createItemRow(item, details, row, closedOrder);
    })
    createDeliveryRow(order, details, row, closedOrder);
}

function createItemRow(item, details, orderRow, closedOrder) {
    const itemRow = document.createElement('div')
    itemRow.classList.add('dictionary-content__row', 'order-element__item');
    itemRow.dataset.id = item.id;
    let tmpField;
    tmpField = createTextField('');
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.article);
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.name);
    itemRow.appendChild(tmpField);
    tmpField = createTextField(item.branding_name);
    tmpField.dataset.name = 'branding_name';
    itemRow.appendChild(tmpField);
    tmpField = createTextField(parseFloat(item.price).toLocaleString('ru-RU',
        {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    tmpField.classList.add('align-right');
    itemRow.appendChild(tmpField);
    tmpField = createTextField((item.quantity).toLocaleString('ru-RU',));
    tmpField.classList.add('align-right');
    itemRow.appendChild(tmpField);
    tmpField = createTextField(parseFloat(item.total_price).toLocaleString('ru-RU',
        {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    tmpField.dataset.name = 'total_amount'
    tmpField.classList.add('align-right');
    itemRow.appendChild(tmpField);
    if (!closedOrder) {
        const button = createSaveButton('Изм');
        button.dataset.id = item.id;
        button.dataset.article = item.article;
        button.addEventListener('click', async (e) => {
            await editItem(e, itemRow, orderRow);
        });
        itemRow.appendChild(button);
    } else {
        tmpField = document.createElement('div');
        itemRow.appendChild(tmpField);
    }
    details.appendChild(itemRow);
    if (item.brandings) {
        item.brandings.forEach(branding => {
            createBranding(branding, item.quantity, details, item.article, orderRow, closedOrder);
        });
    }
}

function createBranding(branding, quantity, details, article, orderRow, closedOrder) {
    const brandingRow = document.createElement('div');
    brandingRow.classList.add('dictionary-content__row', 'order-element__branding');
    let tmpField;
    tmpField = createTextField('');
    brandingRow.appendChild(tmpField);
    let brandingText = `${branding.print_type} ${branding.print_place}, цветов: ${branding.colors}`
    if (branding.second_pass) {
        brandingText += ', второй проход';
    }
    tmpField = createTextField(brandingText);
    tmpField.dataset.name = 'branding_text';
    brandingRow.appendChild(tmpField);

    tmpField = createTextField(parseFloat(branding.price).toLocaleString('ru-RU',
        {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    tmpField.dataset.name = 'price'
    tmpField.classList.add('align-right');
    brandingRow.appendChild(tmpField);
    tmpField = createTextField(quantity.toLocaleString('ru-RU',));
    tmpField.classList.add('align-right');
    brandingRow.appendChild(tmpField);
    tmpField = createTextField(parseFloat(branding.total_price).toLocaleString('ru-RU',
        {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    tmpField.dataset.name = 'total_price'
    tmpField.classList.add('align-right');
    brandingRow.appendChild(tmpField);
    if (!closedOrder) {
        const button = createSaveButton('Изм');
        button.dataset.id = branding.id;
        button.dataset.article = article;
        button.addEventListener('click', async (e) => {
            await editBranding(e, brandingRow, orderRow);
        });
        brandingRow.appendChild(button);
    } else {
        tmpField = document.createElement('div');
        brandingRow.appendChild(tmpField);
    }
    details.appendChild(brandingRow);
}

function createDeliveryRow(order, details, orderRow, closedOrder) {
    const deliveryRow = document.createElement('div');
    deliveryRow.classList.add('dictionary-content__row', 'order-element__branding', 'delivery-row');
    let tmpField
    tmpField = createTextField('');
    deliveryRow.appendChild(tmpField);
    tmpField = createTextField(`доставка ${order.delivery_option}`);
    tmpField.dataset.name = 'delivery_option';
    deliveryRow.appendChild(tmpField);
    tmpField = createTextField('');
    deliveryRow.appendChild(tmpField);
    tmpField = createTextField('');
    deliveryRow.appendChild(tmpField);
    tmpField = createTextField(parseFloat(order.delivery_option_price).toLocaleString('ru-RU',
        {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    tmpField.classList.add('align-right');
    tmpField.dataset.name = 'price';
    deliveryRow.appendChild(tmpField);
    if (!closedOrder) {
        const button = createSaveButton('Изм');
        button.dataset.id = order.id;
        button.dataset.order = order.order_no;
        button.addEventListener('click', async (e) => {
            await editDelivery(e, deliveryRow, orderRow);
        });
        deliveryRow.appendChild(button);
    } else {
        tmpField = document.createElement('div');
        deliveryRow.appendChild(tmpField);
    }
    details.appendChild(deliveryRow);
}

function createTextField(text) {
    const cell = document.createElement('div');
    cell.classList.add('dictionary-content__row_item', 'user-element__cell');
    cell.textContent = text || '';
    return cell;
}


async function repeatOrder(e, orderId) {
    e.preventDefault();
    const response = await fetchJsonData(`/cms/json/order_duplicate/${orderId}`);
    if (response.status === 'ok') {
        const contentRows = document.querySelector('.dictionary-content__rows');
        contentRows.innerHTML = '';
        await createRows(contentRows, 0, '', true, createOrderRow, 'order-element__header', '/cms/json/order_list');
    }
}

/**
 *
 * @param {boolean} show
 * @param {boolean} orderClosed
 * @param {string} fileType
 * @param {Object} order
 * @returns {HTMLUListElement}
 */
function createFileList(show, orderClosed, fileType, order) {
    let li;
    const ul = document.createElement('ul');
    ul.classList.add('file-dropdown__list');
    li = document.createElement('li');
    li.classList.add('file-dropdown__list_item');
    li.textContent = `Загрузить ${fileType}`;
    if (orderClosed) {
        li.style.display = 'none';
    }
    li.addEventListener('click', async (e) => {
        await uploadOrderFile(e, fileType, order);
    });
    ul.appendChild(li);
    li = document.createElement('li');
    li.classList.add('file-dropdown__list_item');
    li.textContent = `Открыть ${fileType}`;
    if (!show) {
        li.style.display = 'none';
    }
    li.addEventListener('click', async (e) => {
        await showOrderFile(e, fileType, order);
    });
    ul.appendChild(li);
    return ul;
}


/**
 *
 * @param {MouseEvent} e
 * @param {string} fileType
 * @param {Object} order
 * @returns {Promise<void>}
 */
async function uploadOrderFile(e, fileType, order) {
    e.preventDefault();

    if (fileType === 'счет') {
        // Оставляем место под отдельную логику для invoice
        return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            alert('Только PDF файлы разрешены');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_type', fileType);
        formData.append('order_id', order.id);

        try {
            const response = await fetch('/cms/json/order_upload_file', {
                method: 'POST',
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                },
                body: formData
            });
            const data = await response.json()
            if (data.status === 'ok') {
                e.target.closest('.file-dropdown').querySelector('button').innerHTML = fullIcon;
                e.target.nextElementSibling.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    fileInput.click();
}

/**
 *
 * @param {MouseEvent} e
 * @param {string} fileType
 * @param {Object} order
 * @returns {Promise<void>}
 */
async function showOrderFile(e, fileType, order) {
    e.preventDefault();
    let url;
    switch (fileType) {
        case 'счет':
            url = `/static/viki_web_cms/files/order/invoice/${order.invoice_file}`
            break;
        case 'макет':
            url = `/static/viki_web_cms/files/order/branding/${order.branding_file}`
            break;
        case 'накладную':
            url = `/static/viki_web_cms/files/order/delivery/${order.delivery_file}`
            break;
    }
        window.open(url, '_blank');
}
