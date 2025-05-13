'use strict';

import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {editBranding, editDelivery, editItem, editOrder} from "./editOrder.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createRows} from "../fullScreenElement/createRows.js";

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
    oldRow.parentNode.replaceChild(details, oldRow);
    details.appendChild(row);
    let tmpField;
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
    tmpField.dataset.id = order.state_id
    tmpField.dataset.name = 'state'
    row.appendChild(tmpField);
    tmpField = createTextField(order.manager);
    tmpField.dataset.id = order.manager_id;
    tmpField.dataset.mail = order.manager_mail;
    row.appendChild(tmpField);
    tmpField = createTextField(order.responsible);
    tmpField.dataset.id = order.responsible_id
    tmpField.dataset.name = 'user_responsible'
    row.appendChild(tmpField);
    tmpField = createTextField(order.days_to_deliver);
    tmpField.dataset.name = 'days_to_deliver'
    row.appendChild(tmpField);
    tmpField = createTextField(order.delivery_date);
    tmpField.dataset.name = 'delivery_date'
    row.appendChild(tmpField);
    tmpField = createNewCheckBox(order.branding === 'True');
    row.appendChild(tmpField);
    tmpField = createNewCheckBox(order.invoice === 'True');
    row.appendChild(tmpField);
    tmpField = createNewCheckBox(order.delivery === 'True')
    row.appendChild(tmpField);
    tmpField = createTextField(order.state_changed_at);
    row.appendChild(tmpField);
    if (!closedOrder) {
        const button = createSaveButton('Изм')
        button.dataset.order = order.order_no;
        button.dataset.id = order.id;
        button.addEventListener('click', async (e) => {
            await editOrder(e, row);
        });
        row.appendChild(button);
    } else {
        const button = createCancelButton('Дубль')
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
    if(!closedOrder){
    const button = createSaveButton('Изм');
    button.dataset.id = order.id;
    button.dataset.order = order.order_no;
    button.addEventListener('click', async (e) => {
        await editDelivery(e, deliveryRow, orderRow);
    });
    deliveryRow.appendChild(button);} else {
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


export function createNewCheckBox(checked) {
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.classList.add('check', 'user-element__check');
    newCheckbox.checked = checked || false;
    newCheckbox.disabled = true;
    return newCheckbox
}

async function repeatOrder(e, orderId){
    e.preventDefault();
    const response = await fetchJsonData(`/cms/json/order_duplicate/${orderId}`);
    if (response.status === 'ok'){
        const contentRows = document.querySelector('.dictionary-content__rows');
        contentRows.innerHTML = '';
        await createRows(contentRows, 0, '', true, createOrderRow, 'order-element__header', '/cms/json/order_list');
    }
}