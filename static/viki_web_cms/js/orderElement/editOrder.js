'use strict';

import {closeModal} from "../modalFunction/closeModal.js";
import {createModalHeader} from "../dictionaryElement/createInput/createModalHeader.js";
import {createButtonBlock} from "../dictionaryElement/createInput/createButtonBlock.js";
import {modalDnD} from "../modalFunction/modalDnD.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createOrderDropdown} from "./createOrderDropdown.js";

export const orderEditOptions = {
    'editOrder': {
        'type': 'editOrder',
        'content': editOrderContent,
    },
    'editItem': {
        'tipe': 'editItem',
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

}

/**
 *
 * @param {Object} data
 * @param {HTMLElement} modalContent
 * @param {string} elementId
 * */
function editItemContent(data, modalContent, elementId) {

}

/**
 *
 * @param {Object} data
 * @param {HTMLElement} modalContent
 * @param {string} elementId
 * */
function editBrandingContent(data, modalContent, elementId) {

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
    modalContent.appendChild(label);
    const dropDown = createOrderDropdown(data.available_options, elementId, 'id')
    modalContent.appendChild(dropDown);
    return modalContent;
}


