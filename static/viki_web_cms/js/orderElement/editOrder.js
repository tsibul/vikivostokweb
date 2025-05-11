'use strict';

import {closeModal} from "../modalFunction/closeModal.js";
import {createModalHeader} from "../dictionaryElement/createInput/createModalHeader.js";
import {createButtonBlock} from "../dictionaryElement/createInput/createButtonBlock.js";
import {modalDnD} from "../modalFunction/modalDnD.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createOrderDropdown} from "./createOrderDropdown.js";
import {createModalInput} from "../dictionaryElement/createInput/createModalInput.js";

export const orderEditOptions = {
    'editOrder': {
        'type': 'editOrder',
        'content': editOrderContent,
    },
    'editItem': {
        'type': 'editItem',
        'content': editItemContent,
    },
    'editBranding': {
        'type': 'editBranding',
        'content': editBrandingContent,
    },
    'editDelivery': {
        'type': 'editDelivery',
        'content': editDeliveryContent,
    }
}


export async function editOrder(e, row) {
    e.preventDefault();
    const orderId = e.target.dataset.id;
    const orderNo = e.target.dataset.order;
    const fieldObl = orderEditOptions.editOrder;
    fieldObl['headerText'] = `заказ ${orderNo}`;
    await openOrderModal(fieldObl, orderId, row, row);
}

export async function editItem(e, row, orderRow) {
    const itemId = e.target.dataset.id;
    const itemArticle = e.target.dataset.article;
    const fieldObl = orderEditOptions.editItem;
    fieldObl['headerText'] = `арт. ${itemArticle}`;
    await openOrderModal(fieldObl, itemId, row, orderRow);
}

export async function editBranding(e, row, orderRow) {
    const brandingId = e.target.dataset.id;
    const itemArticle = e.target.dataset.article;
    const fieldObl = orderEditOptions.editBranding;
    fieldObl['headerText'] = `нанесение для арт. ${itemArticle}`;
    await openOrderModal(fieldObl, brandingId, row, orderRow);

}

export async function editDelivery(e, row, orderRow) {
    const deliveryId = e.target.dataset.id;
    const orderNo = e.target.dataset.order;
    const fieldObl = orderEditOptions.editDelivery;
    fieldObl['headerText'] = `доставку к заказу ${orderNo}`;
    await openOrderModal(fieldObl, deliveryId, row, orderRow);
}

/**
 * open modal for editing element
 * @returns {Promise<void>}
 * @param {Object} fieldObj
 * @param {string} elementId
 * @param {HTMLElement} row
 * @param {HTMLElement} orderRow
 */
export async function openOrderModal(fieldObj, elementId, row, orderRow) {
    const modal = await createOrderModalWindow(fieldObj, elementId, row, orderRow);
    const service = document.querySelector('.service');
    service.appendChild(modal);
    modal.showModal();
    modalDnD(modal);
}

/**
 *
 * @param {Object} fieldObj
 * @param {string} elementId
 * @param {HTMLElement} row
 * @param {HTMLElement} orderRow
 * @returns {Promise<HTMLDialogElement>}
 */
async function createOrderModalWindow(fieldObj, elementId, row, orderRow) {
    const modalWindow = document.createElement("dialog");
    modalWindow.classList.add('modal');
    modalWindow.addEventListener('keypress', (e) => {
        e.key === 'Escape' ? closeModal(modalWindow) : null;
    })
    const modalHeader = createModalHeader(modalWindow, fieldObj.headerText, elementId);
    modalWindow.appendChild(modalHeader);
    const form = document.createElement('form');
    form.id = fieldObj.type + '__form';
    form.classList.add('modal__form');
    form.enctype = 'multipart/form-data';
    const modalContent = await createOrderModalContent(fieldObj, elementId);
    // form.appendChild(elemId);
    form.appendChild(modalContent);
    form.appendChild(createButtonBlock(modalWindow, elementId));
    modalWindow.appendChild(form);
    const initialData = new FormData(form)
    const buttonSubmit = form.querySelector('.submit');
    buttonSubmit.addEventListener('click', (e) => sendOrderForm(e, fieldObj, form, initialData))
    return modalWindow;
}

/**
 *
 * @param {Object} fieldObj
 * @param {string} elementId
 * @returns {Promise<*>}
 */
async function createOrderModalContent(fieldObj, elementId) {
    const params = new URLSearchParams({
        id: elementId,
        type: fieldObj.type,
    });
    const data = await fetchJsonData(`json/order_modal_request?${params.toString()}`);
    const modalContent = document.createElement('div')
    modalContent.classList.add('modal__content')
    return fieldObj.content(data, modalContent, elementId);
}


async function sendOrderForm(e, fieldObj, form, initialData) {

}

/**
 *
 * @param {Object} data
 * @param {HTMLElement} modalContent
 * @param {string} elementId
 * */
function editOrderContent(data, modalContent, elementId) {
    return modalContent;
}

/**
 *
 * @param {Object} data
 * @param {HTMLElement} modalContent
 * @param {string} elementId
 * */
function editItemContent(data, modalContent, elementId) {
    const label = document.createElement('label');
    label.htmlFor = `itemPrice_${elementId}`
    label.textContent = 'цена';
    label.classList.add('modal__content_label')
    modalContent.appendChild(label);
    const priceInput = createModalInput('number');
    priceInput.id = `itemPrice_${elementId}`;
    priceInput.name = 'price';
    priceInput.step = '0.01';
    priceInput.value = data.price;
    priceInput.classList.add('modal__content_number');
    modalContent.appendChild(priceInput);
    if (Object.keys(data).includes('branding_name')) {
        const brandingLabel = document.createElement('label');
        brandingLabel.htmlFor = `itemBranding_${elementId}`
        brandingLabel.textContent = 'нанесение';
        brandingLabel.classList.add('modal__content_label')
        modalContent.appendChild(brandingLabel);
        const brandingInput = createModalInput('text');
        brandingInput.id = `itemBranding_${elementId}`;
        brandingInput.name = 'branding_name';
        brandingInput.value = data.branding_name;
        brandingInput.classList.add('modal__content_text');
        modalContent.appendChild(brandingInput);
    }
    return modalContent;
}

/**
 *
 * @param {Object} data
 * @param {HTMLElement} modalContent
 * @param {string} elementId
 * */
function editBrandingContent(data, modalContent, elementId) {
    const printTypeLabel = document.createElement('div');
    printTypeLabel.textContent = 'тип нанесения';
    printTypeLabel.classList.add('modal__content_label');
    printTypeLabel.htmlFor = `printType_${elementId}`;
    modalContent.appendChild(printTypeLabel);
    const printTypeDropDown = createOrderDropdown(data.available_print_types, data.print_type_id, 'print_type__id')
    printTypeDropDown.id = `printType_${elementId}`
    modalContent.appendChild(printTypeDropDown);
    const printPlaceLabel = document.createElement('div');
    printPlaceLabel.textContent = 'тип нанесения';
    printPlaceLabel.classList.add('modal__content_label');
    printPlaceLabel.htmlFor = `printPlace_${elementId}`;
    modalContent.appendChild(printPlaceLabel);
    const printPlaceDropDown = createOrderDropdown(data.available_print_places, data.print_place_id, 'print_place__id')
    printPlaceDropDown.id = `printPlace_${elementId}`;
    modalContent.appendChild(printPlaceDropDown);
    const colorLabel = document.createElement('div');
    colorLabel.textContent = 'кол-во цветов';
    colorLabel.classList.add('modal__content_label');
    colorLabel.htmlFor = `color_${elementId}`;
    modalContent.appendChild(colorLabel);
    const colorDropDown = createOrderDropdown(data.available_colors, data.colors, 'print_place__id');
    colorDropDown.id = `color_${elementId}`;
    modalContent.appendChild(colorDropDown);
    const passLabel = document.createElement('div');
    passLabel.textContent = 'второй проход';
    passLabel.classList.add('modal__content_label');
    passLabel.htmlFor = `pass_${elementId}`;
    modalContent.appendChild(passLabel);
    const pass = createModalInput('checkbox');
    pass.name = 'second_pass'
    pass.classList.add('check')
    pass.id = `pass_${elementId}`;
    modalContent.appendChild(pass);
    return modalContent;
}

/**
 * create content for edit delivery option
 * @param {Object} data
 * @param {HTMLElement} modalContent
 * @param {string} elementId
 */
function editDeliveryContent(data, modalContent, elementId) {
    const label = document.createElement('div');
    label.textContent = 'доставка';
    label.classList.add('modal__content_label')
    modalContent.appendChild(label);
    const dropDown = createOrderDropdown(data.available_options, elementId, 'id')
    modalContent.appendChild(dropDown);
    return modalContent;
}


