/**
 * @fileoverview Module for handling simple product constructor functionality
 * @module constructor/openSimpleConstructor
 */

'use strict'

import {closeConstructor} from "./closeConstructor.js";
import {applyConstructor} from "./applyConstructor.js";

/**
 * Opens a simple constructor dialog for product customization
 * @param {Event} e - Click event on the product element
 */
export function openSimpleConstructor(e) {
    let optionSection, sectionTitle, section;
    const goodsItem = e.target.closest('.product');
    const currentFrame = e.target.closest('.product-frame');
    const itemId = currentFrame.dataset.id;
    const colorSet = JSON.parse(goodsItem.dataset.articleSet);
    const modal = document.createElement('dialog');
    modal.classList.add('simple-constructor');
    const modalItems = document.createElement('form');
    modalItems.id = 'constructor';
    modalItems.classList.add('simple-constructor__items');
    modal.appendChild(modalItems);
    colorSet.forEach((element) => {
        section = document.createElement('div');
        modalItems.appendChild(section);
        sectionTitle = document.createElement('h4');
        section.appendChild(sectionTitle);
        optionSection = document.createElement('div');
        section.appendChild(optionSection);
        if (!Object.keys(element).includes('option')) {
            sectionTitle.textContent = element['parts_description__name'];
            optionSection.classList.add('simple-constructor__color');
            createColorBlock(element, optionSection, itemId, modal)
        } else {
            sectionTitle.textContent = 'опция';
            optionSection.classList.add('simple-constructor__option');
            createOptionBlock(element, optionSection, modal)
        }
    });
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('simple-constructor__footer');
    const alert = document.createElement('div');
    alert.classList.add('simple-constructor__alert');
    modalFooter.appendChild(alert);
    const btnBlock = document.createElement('div');
    btnBlock.classList.add('btn-block');
    modalFooter.appendChild(btnBlock);
    modal.appendChild(modalFooter);
    const btnApply = document.createElement('button');
    btnApply.classList.add('btn', 'btn__save');
    btnApply.textContent = 'Применить';
    btnApply.addEventListener('click', () => {
        applyConstructor(modal, goodsItem, currentFrame);
    })
    const btnCancel = document.createElement('button');
    btnCancel.classList.add('btn', 'btn__cancel');
    btnCancel.textContent = 'Закрыть';
    btnCancel.addEventListener('click', () => {
        closeConstructor(modal)
    })
    btnBlock.appendChild(btnCancel);
    btnBlock.appendChild(btnApply);
    document.body.appendChild(modal);
    modal.showModal();
}

/**
 * Creates color selection block in the constructor
 * @param {Object} element - Color data object
 * @param {HTMLElement} optionSection - Container for color options
 * @param {string} itemId - Product ID
 * @param {HTMLElement} modal - Constructor dialog element
 */
function createColorBlock(element, optionSection, itemId, modal) {
    element['color'].forEach((color) => {
        const colorInput = document.createElement('input');
        colorInput.type = 'radio';
        colorInput.name = element['position'];
        colorInput.id = color.name + color.code + element.position + '_' + itemId;
        colorInput.value = color.code;
        colorInput.hidden = true;
        optionSection.appendChild(colorInput);
        const labelFrame = document.createElement('div');
        labelFrame.classList.add('simple-constructor__square_frame');
        const colorLabel = document.createElement('label');
        colorLabel.classList.add('simple-constructor__square', 'tooltip');
        colorLabel.style.backgroundColor = color.hex;
        colorLabel.htmlFor = color.name + color.code + element.position + '_' + itemId;
        const toolTipText = document.createElement('div');
        toolTipText.classList.add('tooltip-text');
        toolTipText.textContent = color.name;
        colorLabel.appendChild(toolTipText);
        labelFrame.appendChild(colorLabel);
        optionSection.appendChild(labelFrame);
        colorInput.addEventListener('change', (e) => {
            modal.querySelector('.simple-constructor__alert').textContent = '';
            const allLabels = optionSection.querySelectorAll('.simple-constructor__square_frame');
            [...allLabels].forEach((label) => {
                label.style.visibility = 'hidden';
            })
            labelFrame.style.visibility = 'visible';
        })
    });
}

/**
 * Creates option selection block in the constructor
 * @param {Object} element - Option data object
 * @param {HTMLElement} optionSection - Container for option elements
 * @param {HTMLElement} modal - Constructor dialog element
 */
function createOptionBlock(element, optionSection, modal) {
    element['option'].forEach((option) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('simple-constructor__option_element');
        optionSection.appendChild(optionElement);
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.id = option.option_article;
        optionInput.value = option.option_article;
        optionElement.appendChild(optionInput);
        const optionLabel = document.createElement('label');
        optionLabel.textContent = option.name;
        optionLabel.htmlFor = option.option_article;
        optionElement.appendChild(optionLabel);
        optionInput.addEventListener('change', (e) => {
            modal.querySelector('.simple-constructor__alert').textContent = '';
        })
    });
}
