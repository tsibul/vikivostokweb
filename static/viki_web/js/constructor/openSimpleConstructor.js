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
    const currentFrame = e.target.closest('.product-frame');
    const goodsItem = e.target.closest('.product');
    const articleSetAttr = goodsItem.getAttribute('data-article-set');
    const itemData = JSON.parse(articleSetAttr);
    const descriptionSet = itemData.description;
    const itemSet = itemData.catalogue_items;
    const positionQuantity = descriptionSet.length;
    const ifOption = itemSet[0].option.option !== null;
    const modal = document.createElement('dialog');
    modal.classList.add('simple-constructor');
    const modalItems = document.createElement('div');
    modalItems.id = 'constructor';
    modalItems.classList.add('simple-constructor__items');
    modal.appendChild(modalItems);
    section = document.createElement('div');
    modalItems.appendChild(section);
    sectionTitle = document.createElement('h4');
    section.appendChild(sectionTitle);
    optionSection = document.createElement('div');
    section.appendChild(optionSection);
    let position = 1;
    optionSection.classList.add('simple-constructor__color');
    createColorBlock(colorsLeft(itemSet, 1), optionSection, itemSet, position, positionQuantity,
        ifOption, sectionTitle, descriptionSet, currentFrame)
    document.body.appendChild(modal);
    modal.showModal();

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('simple-constructor__footer');
    const alert = document.createElement('div');
    alert.classList.add('simple-constructor__alert');
    modalFooter.appendChild(alert);
    const btnBlock = document.createElement('div');
    btnBlock.classList.add('btn-block');
    modalFooter.appendChild(btnBlock);
    modal.appendChild(modalFooter);
    const btnCancel = document.createElement('button');
    btnCancel.classList.add('btn', 'btn__cancel');
    btnCancel.textContent = 'Закрыть';
    btnCancel.addEventListener('click', () => {
        closeConstructor(modal)
    })
    btnBlock.appendChild(btnCancel);
}

/**
 * Creates color selection block in the constructor
 * @param {Object} element - Color data object
 * @param {HTMLElement} optionSection - Container for color options
 * @param {object} itemSet
 * @param {number} position
 * @param {number} positionQuantity
 * @param {boolean} ifOption
 * @param {HTMLElement} sectionTitle
 * @param {Object} descriptionSet
 * @param {HTMLElement} currentFrame
 */
function createColorBlock(element, optionSection, itemSet, position,
                          positionQuantity, ifOption, sectionTitle,
                          descriptionSet, currentFrame) {
    const description = descriptionSet.find(element => element.position === position);
    sectionTitle.textContent = description.parts_description__name
    element.forEach((color) => {
        const colorLabel = document.createElement('div');
        colorLabel.classList.add('simple-constructor__square', 'tooltip');
        colorLabel.style.backgroundColor = color.hex;
        colorLabel.dataset.code = color.code;
        const toolTipText = document.createElement('div');
        toolTipText.classList.add('tooltip-text');
        toolTipText.textContent = color.name;
        colorLabel.appendChild(toolTipText);
        optionSection.appendChild(colorLabel);
        colorLabel.addEventListener('click', (e) => {
            const itemsFiltered = itemsLeft(itemSet, position, e.target.dataset.code);
            optionSection.innerHTML = '';
            if (ifOption && position === positionQuantity - 1) {
                sectionTitle.textContent = descriptionSet.find(element => element.position === position + 1)
                    .parts_description__name;
                createOptionBlock(optionsLeft(itemsFiltered), optionSection, itemsFiltered,
                    descriptionSet, currentFrame, sectionTitle);
            } else if (!ifOption && position < positionQuantity || ifOption && position < positionQuantity - 1) {
                createColorBlock(colorsLeft(itemsFiltered, position + 1), optionSection, itemsFiltered,
                    position + 1, positionQuantity, ifOption, sectionTitle,
                    descriptionSet, currentFrame);
            } else {
                createFinalBlock(itemsFiltered[0], optionSection, descriptionSet, currentFrame,
                    sectionTitle);
            }
        })
    });
}

/**
 * Creates option selection block in the constructor
 * @param {Object} element - Option data object
 * @param {HTMLElement} optionSection - Container for option elements
 * @param {Object} itemsFiltered
 * @param {Object} descriptionSet
 * @param {HTMLElement} currentFrame
 * @param {HTMLElement} sectionTitle
 */
function createOptionBlock(element, optionSection, itemsFiltered,
                           descriptionSet, currentFrame, sectionTitle) {
    element.forEach((option) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('simple-constructor__option_element');
        optionSection.appendChild(optionElement);
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.id = option.article;
        optionInput.value = option.article;
        optionElement.appendChild(optionInput);
        const optionLabel = document.createElement('label');
        optionLabel.textContent = option.option;
        optionLabel.htmlFor = option.article;
        optionLabel.dataset.id = option.article;
        optionElement.appendChild(optionLabel);
        optionLabel.addEventListener('click', (e) => {
            const itemsChosen = itemsFiltered.filter(el => el.option.article === e.target.dataset.id)[0];
            createFinalBlock(itemsChosen, optionSection, descriptionSet, currentFrame, sectionTitle);
        })
    });
}

/**
 *
 * @param {Array} itemLeft
 * @param {HTMLElement} optionSection
 * @param {Object} descriptionSet
 * @param {HTMLElement} currentFrame
 * @param {HTMLElement} sectionTitle
 */
function createFinalBlock(itemLeft, optionSection, descriptionSet,
                          currentFrame, sectionTitle) {
    optionSection.innerHTML = '';
    sectionTitle.textContent = 'Выбранный товар';
    const itemId = itemLeft.id;
    const modal = optionSection.closest('.simple-constructor');
    const btnBlock = modal.querySelector('.btn-block');
    const btnApply = document.createElement('button');
    btnApply.classList.add('btn', 'btn__save');
    btnApply.textContent = 'Применить';
    btnApply.addEventListener('click', () => {
        applyConstructor(modal, itemId, currentFrame);
    });
    btnBlock.insertAdjacentElement('afterbegin', btnApply)

    optionSection.classList.remove('simple-constructor__color');
    optionSection.classList.add('simple-constructor__final');
    let rowItem;
    descriptionSet.forEach(description => {
        const row = document.createElement('div')
        row.classList.add('simple-constructor__final_row');
        optionSection.appendChild(row);
        rowItem = document.createElement('div');
        rowItem.textContent = description.parts_description__name;
        row.appendChild(rowItem);
        rowItem = document.createElement('div');
        const color = itemLeft.colors.find(color => color.position === description.position);
        if (color) {
            rowItem.classList.add('simple-constructor__final_row-item');
            const colorName = document.createElement('div');
            colorName.textContent = color.name;
            rowItem.appendChild(colorName);
            const colorSquare = document.createElement('div');
            colorSquare.classList.add('square');
            colorSquare.style.backgroundColor = color.hex;
            rowItem.appendChild(colorSquare);
        } else if (itemLeft.option) {
            rowItem = document.createElement('div');
            rowItem.textContent = itemLeft.option.option;

        }
        row.appendChild(rowItem);
    })

}

function itemsLeft(itemSet, position, colorSelected) {
    return itemSet.filter(item =>
        item.colors.some(color => color.code === colorSelected && color.position === position
        )
    );
}

function colorsLeft(itemsFiltered, position) {
    const seenCodes = new Set();
    return itemsFiltered
        .flatMap(item => item.colors)
        .filter(color => color.position === position)
        .filter(color => {
            if (seenCodes.has(color.code)) {
                return false; // уже видели такой code — пропускаем
            }
            seenCodes.add(color.code);
            return true; // первый раз видим такой code — оставляем
        });
}

function optionsLeft(itemsFiltered) {
    return itemsFiltered.map(item => item.option);
}


