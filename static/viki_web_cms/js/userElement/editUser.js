/**
 * @fileoverview Module for editing user data
 * @module userElement/editUser
 */

'use strict';

import {modalDnD} from '../modalFunction/modalDnD.js';
import {closeModal} from '../modalFunction/closeModal.js';
import {fetchJsonData} from '../fetchJsonData.js';
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {getCSRFToken} from "../getCSRFToken.js";
import {createModalInput} from "../dictionaryElement/createInput/createModalInput.js";

/**
 * Opens modal window for editing user data
 * @param {HTMLElement} row
 * @param {MouseEvent} e
 */
export async function editUser(e, row) {
    const userId = e.target.dataset.id
    try {
        // Fetch user data and dropdown options in a single request
        const userData = await fetchJsonData(`/cms/json/user_extension_item/${userId}`);
        if (!userData) {
            console.error('Failed to fetch user data');
            return;
        }
        createEditModal(userData, row);
    } catch (error) {
        console.error('Error editing user:', error);
    }
}

/**
 * Creates and displays modal window for user editing
 * @param {Object} userData - User data with dropdown options
 * @param {HTMLElement} row
 */
function createEditModal(userData, row) {
    // Create modal container
    const modal = document.createElement('dialog');
    modal.classList.add('modal');

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal__header');
    modalHeader.textContent = `Редактирование пользователя`;
    modal.appendChild(modalHeader);

    const form = document.createElement('form');
    form.classList.add('modal__form');
    modal.appendChild(form);

    // Modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');
    form.appendChild(modalContent);

    //alias field
    const aliasLabel = document.createElement('label');
    aliasLabel.textContent = 'eMail-alias';
    aliasLabel.classList.add('modal-content__label');
    aliasLabel.htmlFor = 'alias'
    modalContent.appendChild(aliasLabel);
    const aliasField = createModalInput('text');
    aliasField.value = userData.alias;
    aliasField.name = 'alias';
    aliasField.id = 'alias';
    modalContent.appendChild(aliasField);


    // New status field
    const newLabel = document.createElement('label');
    newLabel.textContent = 'Новый:';
    newLabel.classList.add('modal-content__label');
    newLabel.htmlFor = 'user-new-status'
    modalContent.appendChild(newLabel);
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.classList.add('modal__content_checkbox');
    newCheckbox.checked = userData.new || false;
    newCheckbox.id = 'user-new-status';
    newCheckbox.name = 'new'
    modalContent.appendChild(newCheckbox);

    // Customer dropdown field
    const customerLabel = document.createElement('label');
    customerLabel.textContent = 'Клиент:';
    customerLabel.classList.add('modal-content__label');
    customerLabel.htmlFor = 'customer'
    modalContent.appendChild(customerLabel);
    const customerDropdownContainer = document.createElement('div');
    customerDropdownContainer.classList.add('dropdown');
    createDropDown(customerDropdownContainer, userData.customer_id, userData.customers, 'customer');
    modalContent.appendChild(customerDropdownContainer);

    // Modal footer with buttons
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal__button-block');

    const cancelButton = createCancelButton('Отменить');
    cancelButton.addEventListener('click', () => {
        closeModal(modal);
    });
    modalFooter.appendChild(cancelButton);

    const saveButton = createSaveButton('Сохранить')
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault()
        await saveUserData(form, userData.id, userData.customer_id, userData.new, userData.alias, row);
    });
    modalFooter.appendChild(saveButton);
    form.appendChild(modalFooter);

    // Add modal to document
    document.body.appendChild(modal);

    // Enable dragging
    modalDnD(modal);

    // Show modal
    modal.showModal();
}

/**
 * Creates dropdown for selection
 * @param {HTMLElement} dropDown - Container element
 * @param {string} selectedValue - Currently selected value
 * @param {Array} options - Available options
 * @param {string} name
 */
function createDropDown(dropDown, selectedValue, options, name) {
    // Create custom dropdown

    const dropDownInput = document.createElement('input');
    dropDownInput.type = 'text';
    dropDownInput.classList.add('modal__content_text', 'dropdown__input');

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.name = name;
    hiddenInput.hidden = true;

    // Set initial values
    const selectedOption = options.find(opt => opt.id.toString() === selectedValue.toString());
    if (selectedOption) {
        dropDownInput.value = selectedOption.value;
        hiddenInput.value = selectedOption.id;
    }

    dropDown.appendChild(dropDownInput);
    dropDown.appendChild(hiddenInput);

    // Add dropdown icon
    dropDown.insertAdjacentHTML('beforeend',
        '<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');

    // Create dropdown list
    const dropdownUl = document.createElement('ul');
    dropdownUl.classList.add('dropdown__list', 'invisible');

    // Add options to list
    options.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('dropdown__list_item');
        listItem.value = item.id;
        listItem.textContent = item.value;

        listItem.addEventListener('click', (e) => {
            dropDownInput.value = e.target.textContent;
            hiddenInput.value = e.target.value;
            hiddenInput.dispatchEvent(new Event('change', {bubbles: true}));
            dropdownUl.classList.add('invisible');
        });

        dropdownUl.appendChild(listItem);
    });

    dropDown.appendChild(dropdownUl);

    // Toggle dropdown visibility on click
    dropDownInput.addEventListener('click', () => {
        dropdownUl.classList.toggle('invisible');
    });

    // Add filter functionality
    dropDownInput.addEventListener('keyup', (e) => {
        const filter = e.target.value.toUpperCase();
        const filteredOptions = options.filter(item =>
            item.value.toUpperCase().indexOf(filter) > -1);

        dropdownUl.innerHTML = '';
        filteredOptions.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('dropdown__list_item');
            listItem.value = item.id;
            listItem.textContent = item.value;

            listItem.addEventListener('click', (evt) => {
                dropDownInput.value = evt.target.textContent;
                hiddenInput.value = evt.target.value;
                hiddenInput.dispatchEvent(new Event('change', {bubbles: true}));
                dropdownUl.classList.add('invisible');
            });

            dropdownUl.appendChild(listItem);
        });
    });
}

/**
 * Saves user data to server
 * @param {HTMLFormElement} modal - Modal dialog element
 * @param {number} userId - User ID
 * @param {number} customerId
 * @param {boolean} isNew
 * @param {string} alias
 * @param {HTMLElement} row
 */
async function saveUserData(modal, userId, customerId, isNew, alias, row) {
    const dialog = modal.closest('dialog');

    try {
        const formData = new FormData(modal);
        if (customerId === Number.parseInt(formData.get('customer')) &&
            isNew === (formData.get('new') === 'on') &&
            alias === formData.get('alias')
        ) {
            closeModal(dialog);
            return
        }

        // Send data to server
        const response = await fetch(`/cms/json/update_user_extension/${userId}`, {
            method: 'POST',
            body: formData,
            headers: {
                "X-CSRFToken": getCSRFToken(),
            }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const check = row.querySelector('input[type="checkbox"]')
                check.checked = result.new;
                row.querySelector('.alias').textContent = result.alias;
                row.querySelector('.customer').textContent = result.customer;
                closeModal(dialog);
            } else {
                console.error('Failed to update user:', result.error);
            }
        } else {
            console.error('Failed to update user, server returned:', response.status);
        }
    } catch (error) {
        console.error('Error saving user data:', error);
    }
} 