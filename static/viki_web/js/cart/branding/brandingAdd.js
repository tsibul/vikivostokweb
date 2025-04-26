/**
 * Branding Add Module
 * Handles adding new branding to cart items
 */

import eventBus from '../eventBus.js';
import {updateCartItemBranding} from '../cartStorage.js';
import {
    fetchPrintOpportunities,
    getUniqueTypes,
    getLocationsForType,
    getColorsForTypeAndLocation,
    getBrandingPrice,
    isLocationAvailable
} from './brandingOptionsManager.js';
import {notificationClose, showErrorNotification} from '../addToCart/notification.js';
// Import the dropdown handler functions
import {initBrandingDropdowns} from './dropdownHandler.js';
import {getCartItem} from "../storage/cartStorage.js";

/**
 * Initialize branding add functionality
 */
export function initBrandingAdd() {
    eventBus.subscribe('cart:branding:add', async (data) => {
        await showBrandingDialog(data.goodsId, data.itemId);
    });
}

/**
 * Filter available branding types based on location availability
 * @param {Array} opportunities - Print opportunities
 * @param {Array} existingBranding - Existing branding items
 * @returns {Array} Available types with at least one available location
 */
export function filterAvailableTypes(opportunities, existingBranding) {
    if (!opportunities || !opportunities.length) {
        return [];
    }

    const allTypes = getUniqueTypes(opportunities);

    // Filter only types that have at least one available location
    return allTypes.filter(type => {
        const locations = getLocationsForType(opportunities, type.id);
        return locations.some(location =>
            isLocationAvailable(opportunities, existingBranding, type.id, location.id)
        );
    });
}

/**
 * Check if any branding options are available for an item
 * @param {Array} opportunities - Print opportunities
 * @param {Array} existingBranding - Existing branding items
 * @returns {boolean} True if any branding options are available
 */
export function isAnyBrandingAvailable(opportunities, existingBranding) {
    if (!opportunities || !opportunities.length) {
        return false;
    }

    // Check if any type has available locations
    const types = getUniqueTypes(opportunities);
    for (const type of types) {
        const locations = getLocationsForType(opportunities, type.id);
        for (const location of locations) {
            if (isLocationAvailable(opportunities, existingBranding, type.id, location.id)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Show dialog to add branding
 * @param {string} goodsId - Goods ID
 * @param itemId
 */
async function showBrandingDialog(goodsId, itemId) {
    // Get current cart item and its branding
    const cartItem = getCartItem(itemId);
    const existingBranding = cartItem ? cartItem.branding || [] : [];

    // Fetch print opportunities for this item
    const opportunities = await fetchPrintOpportunities(goodsId);
    // console.log('Print opportunities:', opportunities);

    if (!opportunities || opportunities.length === 0) {
        showBrandingNotification();//'Для данного товара нет доступных опций брендирования.');
        return;
    }

    // Check if any branding options are available
    if (!isAnyBrandingAvailable(opportunities, existingBranding)) {
        showBrandingNotification();
        return;
    }

    // Create modal dialog
    const modal = document.createElement('dialog');
    modal.className = 'branding-modal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'branding-modal__content';

    // Create modal title
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'branding-modal__title';
    modalTitle.textContent = 'Добавить брендирование';

    // Create modal close button
    const closeButton = document.createElement('button');
    closeButton.className = 'branding-modal__close';
    closeButton.innerHTML = '&times;';

    // Create form
    const form = document.createElement('form');
    form.id = 'branding-add-form';

    // Create type select
    const typeGroup = document.createElement('div');
    typeGroup.className = 'branding-modal__form-group';

    const typeLabel = document.createElement('label');
    typeLabel.className = 'branding-modal__label';
    typeLabel.textContent = 'Тип нанесения:';

    const typeDropdown = document.createElement('div');
    typeDropdown.className = 'viki-dropdown';

    // Filter types to only include those with available locations
    const availableTypes = filterAvailableTypes(opportunities, existingBranding);
    let typeList = ''
    availableTypes.forEach(type => {
        const option = `
        <li class="branding-modal__li" value="${type.id}">${type.name}</li>
        `;
        typeList += option;
    });


    typeDropdown.insertAdjacentHTML('afterbegin', dropdownHtml(typeList,
        'branding-type', 'Выберите тип нанесения'))

    // Add options for types

    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(typeDropdown);

    // Create location select
    const locationGroup = document.createElement('div');
    locationGroup.className = 'branding-modal__form-group';

    const locationLabel = document.createElement('label');
    locationLabel.className = 'branding-modal__label';
    locationLabel.textContent = 'Место нанесения:';

    const locationDropdown = document.createElement('div');
    locationDropdown.className = 'viki-dropdown';

    const locationList = updateLocationOptions(opportunities, null, existingBranding);
    locationDropdown.insertAdjacentHTML('afterbegin', dropdownHtml(locationList,
        'branding-location', 'Выберите место нанесения'));

    // Add initial options for locations

    locationGroup.appendChild(locationLabel);
    locationGroup.appendChild(locationDropdown);

    // Create colors select
    const colorsGroup = document.createElement('div');
    colorsGroup.className = 'branding-modal__form-group';

    const colorsLabel = document.createElement('label');
    colorsLabel.className = 'branding-modal__label';
    colorsLabel.textContent = 'Количество цветов:';

    const colorsDropdown = document.createElement('div');

    colorsDropdown.className = 'viki-dropdown';
    const colorList = updateColorOptions(opportunities, null, null);
    colorsDropdown.insertAdjacentHTML('afterbegin', dropdownHtml(colorList,
        'branding-colors', 'Выберите количество цветов'));

    // Add initial options for colors

    colorsGroup.appendChild(colorsLabel);
    colorsGroup.appendChild(colorsDropdown);

    // Create second pass checkbox
    const secondPassGroup = document.createElement('div');
    secondPassGroup.className = 'branding-modal__checkbox-group';

    const secondPassCheckbox = document.createElement('input');
    secondPassCheckbox.type = 'checkbox';
    secondPassCheckbox.id = 'branding-second-pass';

    const secondPassLabel = document.createElement('label');
    secondPassLabel.htmlFor = 'branding-second-pass';
    secondPassLabel.textContent = 'Второй проход';
    secondPassLabel.className = 'branding-modal__label'

    secondPassGroup.appendChild(secondPassLabel);
    secondPassGroup.appendChild(secondPassCheckbox);

    // Create buttons
    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'branding-modal__buttons';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn__cancel';
    cancelButton.textContent = 'Отмена';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn__save';
    addButton.textContent = 'Добавить';

    buttonsGroup.appendChild(cancelButton);
    buttonsGroup.appendChild(addButton);

    // Add all elements to form
    form.appendChild(typeGroup);
    form.appendChild(locationGroup);
    form.appendChild(colorsGroup);
    form.appendChild(secondPassGroup);
    form.appendChild(buttonsGroup);

    // Add form to modal
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(form);

    // Add modal to document
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Event listeners
    closeButton.addEventListener('click', (e) => {
        modal.close();
        modal.remove();
    });

    cancelButton.addEventListener('click', (e) => {
        modal.close()
        modal.remove();
    });


    // Initialize dropdown handlers with event delegation
    initBrandingDropdowns(form, opportunities, existingBranding);

    // Add branding when form is submitted
    addButton.addEventListener('click', () => {
        const typeId = typeDropdown.querySelector('input').value;
        const locationId = locationDropdown.querySelector('input').value;
        const colors = parseInt(colorsDropdown.querySelector('input').value);
        const secondPass = secondPassCheckbox.checked;

        if (!typeId || !locationId || !colors) {
            showErrorNotification('Пожалуйста, заполните все поля');
            return;
        }

        // Get price for this branding option
        const price = getBrandingPrice(
            opportunities,
            Number.parseInt(typeId),
            Number.parseInt(locationId),
            colors,
            getCartItem(itemId).quantity
        );

        // Create new branding item
        const newBranding = {
            type_id: Number.parseInt(typeId),
            type: typeDropdown.querySelector('.viki-dropdown__trigger-text').textContent,
            location_id: Number.parseInt(locationId),
            location: locationDropdown.querySelector('.viki-dropdown__trigger-text').textContent,
            colors: colors,
            secondPass: secondPass,
            price: price
        };

        // Update storage
        updateCartItemBranding(itemId, newBranding);

        // Close modal
        modal.close();
        modal.remove();
    });
}

/**
 * Update location options based on selected type and existing branding
 * @param {Array} opportunities - Print opportunities
 * @param {string|number} typeId - Selected type ID
 * @param {Array} existingBranding - Existing branding items
 */
export function updateLocationOptions(opportunities, typeId, existingBranding) {

    // Get locations for this type
    const locations = getLocationsForType(opportunities, typeId);

    // Add options
    let count = 0;
    let locationList = '';
    locations.forEach(location => {
        // Check if this location is still available
        if (isLocationAvailable(opportunities, existingBranding, typeId, location.id)) {
            const option = `
            <li class="branding-modal__li" value="${location.id}">${location.name}</li>
            `;
            locationList += option;
        }
    });
    return locationList;
}

/**
 * Update color options based on selected type and location
 * @param {Array} opportunities - Print opportunities
 * @param {string|number} typeId - Selected type ID
 * @param {string|number} locationId - Selected location ID
 */
export function updateColorOptions(opportunities, typeId, locationId) {
    let colorsList = '';

    // Get color options for this type and location
    const colorOptions = getColorsForTypeAndLocation(opportunities, typeId, locationId);

    // Add options
    colorOptions.forEach(colorCount => {
        const colorText = colorCount === 1
            ? '1 цвет'
            : (colorCount > 1 && colorCount < 5
                ? `${colorCount} цвета`
                : `${colorCount} цветов`);
        const option = `
        <li class="branding-modal__li" value="${colorCount}">${colorText}</li>
        `;
        colorsList += option;
    });
    return colorsList;
}

function showBrandingNotification() {
    const notification = document.createElement('div');
    notification.className = 'success-notification active';
    notification.innerHTML = `
                <i class="fa-solid fa-info success-notification__icon"></i>
                <div class="success-notification__content">
                    <h4 class="success-notification__title"></h4>
                    <p>Для данного товара нет доступных опций брендирования</p>
                </div>
                <button class="success-notification__close">×</button>
            `;
    document.body.appendChild(notification);
    // Add close functionality
    notificationClose(notification);
}


function dropdownHtml(liList, name, placeHolder) {
    return ` <div class="viki-dropdown__trigger branding-modal__trigger">
            <span class="viki-dropdown__trigger-text">${placeHolder}</span>
            <i class="viki-dropdown__trigger-icon">▼</i>
        </div>
        <div class="viki-dropdown__menu">
            <ul class="viki-dropdown__menu-list">
                ${liList}
        </ul>
        </div>
        <input type="hidden" name="${name}">
    `;

}