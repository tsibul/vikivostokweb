'use strict'

import {closeModal} from "../modalFunction/closeModal.js";
import {createModalHeader} from "../dictionaryElement/createInput/createModalHeader.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {priceDateSave} from "./priceDateSave.js";
import {modalDnD} from "../modalFunction/modalDnD.js";

export async function newPriceDate(e) {
    const service = document.querySelector('.service')
    const modalWindow = document.createElement("dialog");
    modalWindow.classList.add('catalogue__modal');
    modalWindow.addEventListener('keypress', (e) => {
        e.key === 'Escape' ? closeModal(modalWindow) : null;
    })
    const modalHeader = createModalHeader(modalWindow, '', 0);
    modalHeader.firstElementChild.textContent = 'Новый прайс лист';
    modalWindow.appendChild(modalHeader);
    const form = document.createElement('form');
    form.id = 'priceDialog';
    form.classList.add('modal__form');
    const priceRow = document.createElement('div');
    priceRow.classList.add('price__modal_row');
    const priceDateLabel = document.createElement('label');
    priceDateLabel.classList.add('price__modal_label');
    priceDateLabel.textContent = 'дата прайс-листа';
    priceDateLabel.htmlFor = 'priceDate';
    const priceDate = document.createElement('input');
    priceDate.classList.add('price__modal_date');
    priceDate.type = 'date';
    priceDate.id = 'priceDate';
    priceDate.name = 'priceDate';
    priceRow.appendChild(priceDateLabel);
    priceRow.appendChild(priceDate);
    form.appendChild(priceRow);

    const promoRow = document.createElement('div');
    promoRow.classList.add('price__modal_row');
    const promoCheckLabel = document.createElement('label');
    promoCheckLabel.classList.add('price__modal_label');
    promoCheckLabel.textContent = 'акция';
    promoCheckLabel.htmlFor = 'promoCheck';
    const promoCheck = document.createElement('input');
    promoCheck.classList.add('price__modal_check');
    promoCheck.type = 'checkbox';
    promoCheck.id = 'promoCheck';
    promoCheck.name = 'promoCheck';
    const promoDateLabel = document.createElement('label');
    promoDateLabel.classList.add('price__modal_label');
    promoDateLabel.textContent = 'окончание';
    promoDateLabel.htmlFor = 'promoDate';
    const promoDate = document.createElement('input');
    promoDate.classList.add('price__modal_date');
    promoDate.type = 'date';
    promoDate.id = 'promoDate';
    promoDate.name = 'promoDate';
    promoRow.appendChild(promoCheckLabel);
    promoRow.appendChild(promoCheck);
    promoRow.appendChild(promoDateLabel);
    promoRow.appendChild(promoDate);
    form.appendChild(promoRow);
    const saveBtn = createSaveButton('Записать');
    saveBtn.addEventListener('click', priceDateSave);
    saveBtn.classList.add('price__modal_btn');
    form.appendChild(saveBtn);
    modalWindow.appendChild(form);
    service.appendChild(modalWindow);
    modalWindow.showModal();
    modalDnD(modalWindow);
}