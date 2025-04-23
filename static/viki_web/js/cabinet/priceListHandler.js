/**
 * @fileoverview Module for handling price list selection for staff users
 * @module cabinet/priceListHandler
 */

'use strict';

/**
 * Initializes price list handler for staff users
 * @param {boolean} isStaff - Whether the current user has staff status
 * @param {Array} priceTypes - List of available price types
 * @param {number} currentPriceId - ID of the currently selected price type
 */
export function initPriceListHandler(isStaff, priceTypes, currentPriceId) {
    const priceInput = document.querySelector('#price');
    const priceDropdown = document.querySelector('#price_dropdown');
    const priceIdInput = document.querySelector('#price_id');
    const dropdownTrigger = priceDropdown?.querySelector('.viki-dropdown__trigger-text');
    const dropdownMenu = priceDropdown?.querySelector('.viki-dropdown__menu');
    
    // Set the current price ID in the hidden input
    if (currentPriceId) {
        priceIdInput.value = currentPriceId;
    }
    
    // If user is not staff, we don't need to do anything else
    if (!isStaff || !priceTypes || !priceTypes.length || !priceDropdown) {
        return;
    }
    
    // Populate the dropdown menu with price types
    priceTypes.forEach(priceType => {
        const listItem = document.createElement('li');
        listItem.className = 'viki-dropdown__menu-item';
        listItem.dataset.id = priceType.id;
        listItem.textContent = priceType.name;
        
        // Set initial selected item text
        if (currentPriceId && priceType.id === currentPriceId) {
            dropdownTrigger.textContent = priceType.name;
        }
        
        // Add click event to select this item
        listItem.addEventListener('click', () => {
            selectPriceOption(priceType.id, priceType.name, isStaff);
            toggleDropdown(false);
        });
        
        dropdownMenu.appendChild(listItem);
    });
    
    // Toggle dropdown when clicking on trigger
    priceDropdown.querySelector('.viki-dropdown__trigger').addEventListener('click', () => {
        toggleDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!priceDropdown.contains(e.target)) {
            toggleDropdown(false);
        }
    });
}

/**
 * Toggles the dropdown open/closed state
 * @param {boolean|undefined} forceState - Force a specific state (open=true, closed=false)
 */
function toggleDropdown(forceState) {
    const dropdown = document.querySelector('#price_dropdown');
    if (!dropdown) return;
    
    if (forceState !== undefined) {
        dropdown.classList.toggle('viki-dropdown--open', forceState);
    } else {
        dropdown.classList.toggle('viki-dropdown--open');
    }
}

/**
 * Shows the price dropdown during edit mode for staff users
 * @param {boolean} isStaff - Whether the current user has staff status
 */
export function showPriceSelect(isStaff) {
    if (!isStaff) {
        return;
    }
    
    const priceInput = document.querySelector('#price');
    const priceDropdown = document.querySelector('#price_dropdown');
    
    // Hide the input and show the dropdown
    priceInput.classList.add('item-hidden');
    priceDropdown.classList.remove('item-hidden');
}

/**
 * Hides the price dropdown and shows the input field
 * @param {boolean} isStaff - Whether the current user has staff status
 */
export function hidePriceSelect(isStaff) {
    if (!isStaff) {
        return;
    }
    
    const priceInput = document.querySelector('#price');
    const priceDropdown = document.querySelector('#price_dropdown');
    
    // Show the input and hide the dropdown
    priceInput.classList.remove('item-hidden');
    priceDropdown.classList.add('item-hidden');
    
    // Close dropdown if open
    toggleDropdown(false);
}

/**
 * Selects a price option and updates the UI
 * @param {number} id - ID of the selected price type
 * @param {string} name - Name of the selected price type
 * @param {boolean} isStaff - Whether the current user has staff status
 */
function selectPriceOption(id, name, isStaff) {
    if (!isStaff) {
        return;
    }
    
    const priceInput = document.querySelector('#price');
    const priceDropdown = document.querySelector('#price_dropdown');
    const priceIdInput = document.querySelector('#price_id');
    const dropdownTrigger = priceDropdown.querySelector('.viki-dropdown__trigger-text');
    
    // Update dropdown trigger text
    dropdownTrigger.textContent = name;
    
    // Update the input and hidden field values
    priceInput.value = name;
    priceIdInput.value = id;
}

/**
 * Updates the price input with the selected value from dropdown
 * @param {boolean} isStaff - Whether the current user has staff status
 */
export function updatePriceInput(isStaff) {
    // This function now does nothing as the values are updated immediately when selecting an option
    // Left for compatibility with existing code that calls this function
} 