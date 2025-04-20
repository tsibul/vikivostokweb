/**
 * Module for branding item management
 */

import { updateItemTotal } from './calculation.js';
import { updateCartSummary } from './summary.js';
import { printOpportunitiesCache } from './brandingCommon.js';
import {
    updateAllLocationOptionsInContainer,
    updateLocationOptions,
    updateColorsOptions,
    attachAddBrandingHandlers,
} from './branding.js';
import { checkAndUpdateAddBrandingButton, updateCartBrandingInLocalStorage } from './brandingHelpers.js';

/**
 * Initializes event handlers for a branding item
 * @param {HTMLElement} brandingItem - Branding item element
 */
export function updateBrandingItem(brandingItem) {
    const cartItem = brandingItem.closest('.cart-item');
    const brandingContainer = brandingItem.closest('.branding-items');
    const addBrandingBtn = cartItem.querySelector('.branding-add-btn');
    const goodsId = addBrandingBtn?.dataset.goodsId;

    // Initialize all dropdown functionality
    const dropdownTriggers = brandingItem.querySelectorAll('.viki-dropdown__trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.closest('.viki-dropdown');

            // Close all other open dropdowns first
            document.querySelectorAll('.viki-dropdown').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('viki-dropdown--open');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('viki-dropdown--open');
        });
    });

    // Process all dropdown menu items by attaching click handlers
    const attachDropdownItemHandlers = (dropdownItems) => {
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const dropdown = this.closest('.viki-dropdown');
                const dropdownList = dropdown.querySelector('.viki-dropdown__menu');
                const trigger = dropdown.querySelector('.viki-dropdown__trigger');

                // Update trigger text and data
                trigger.textContent = this.textContent;
                // Make sure we get the value attribute correctly
                trigger.dataset.id = this.getAttribute('value');

                // Add trigger icon back
                const icon = document.createElement('span');
                icon.className = 'viki-dropdown__trigger-icon';
                icon.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
                trigger.appendChild(icon);

                // Close dropdown
                dropdown.classList.remove('viki-dropdown--open');

                // Create and dispatch a change event on the dropdown
                const changeEvent = new Event('change', { bubbles: true });
                dropdownList.dispatchEvent(changeEvent);
            });
        });
    };

    // Attach handlers to all dropdown items
    const colorDropdownItems = brandingItem.querySelectorAll('.branding-colors li');
    const locationDropdownItems = brandingItem.querySelectorAll('.branding-location li');
    attachDropdownItemHandlers(colorDropdownItems);
    attachDropdownItemHandlers(locationDropdownItems);

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.viki-dropdown')) {
            document.querySelectorAll('.viki-dropdown--open').forEach(dropdown => {
                dropdown.classList.remove('viki-dropdown--open');
            });
        }
    });

    // Branding removal
    const removeButton = brandingItem.querySelector('.branding-remove-btn');
    removeButton.addEventListener('click', function () {
        // Remove element
        brandingItem.remove();

        // Update available options for remaining elements
        if (goodsId) {

            // Update counters and available locations for all remaining elements
            updateAllLocationOptionsInContainer(brandingContainer, goodsId);

            // Unblock add button, since after removal a location should be freed
            if (addBrandingBtn) {
                // First unconditionally unblock button
                addBrandingBtn.disabled = false;
                addBrandingBtn.title = '';
                addBrandingBtn.classList.remove('disabled');

                // Then recheck if there are actually available locations
                checkAndUpdateAddBrandingButton(addBrandingBtn, goodsId, brandingContainer);

                // Reassign handlers for all add buttons
                attachAddBrandingHandlers();
            }
        }

        updateItemTotal(cartItem);
        updateCartSummary();

        // Update data in localStorage
        updateCartBrandingInLocalStorage(cartItem);
    });

    // Print type change handler
    const typeSelect = brandingItem.querySelector('.branding-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', function () {
            const opportunities = printOpportunitiesCache.get(goodsId) || [];
            const typeDropdown = typeSelect.closest('.viki-dropdown');
            const typeTrigger = typeDropdown?.querySelector('.viki-dropdown__trigger');
            const selectedTypeId = typeTrigger.dataset.id;
            
            const locationSelect = brandingItem.querySelector('.branding-location');
            const locationDropdown = locationSelect.closest('.viki-dropdown');
            const locationTrigger = locationDropdown.querySelector('.viki-dropdown__trigger');
            const colorsSelect = brandingItem.querySelector('.branding-colors');

            // Update location options
            if (goodsId && locationSelect) {
                // Clear current location options
                updateLocationOptions(opportunities, selectedTypeId, locationSelect, brandingContainer);

                // After updating location also update color count
                if (locationSelect.querySelectorAll('li').length > 0 && colorsSelect) {
                    const selectedPlaceId = locationTrigger.dataset.id;
                    updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect);
                }
                
                // Update available locations for all elements in this container
                updateAllLocationOptionsInContainer(brandingContainer, goodsId);
                
                // After updating all locations, also update all color options
                // for other branding items based on their current type and location
                const allBrandingItems = brandingContainer.querySelectorAll('.branding-item');
                allBrandingItems.forEach(item => {
                    if (item !== brandingItem) { // Skip the current item that triggered the change
                        const itemTypeDropdown = item.querySelector('.branding-field-type');
                        const itemTypeTrigger = itemTypeDropdown?.querySelector('.viki-dropdown__trigger');
                        const itemLocationDropdown = item.querySelector('.branding-field-location');
                        const itemLocationTrigger = itemLocationDropdown?.querySelector('.viki-dropdown__trigger');
                        const itemColorsSelect = item.querySelector('.branding-colors');
                        
                        if (itemTypeTrigger && itemLocationTrigger && itemColorsSelect && 
                            itemTypeTrigger.dataset.id && itemLocationTrigger.dataset.id) {
                            updateColorsOptions(
                                opportunities, 
                                itemTypeTrigger.dataset.id, 
                                itemLocationTrigger.dataset.id, 
                                itemColorsSelect
                            );
                        }
                    }
                });
            } else if (colorsSelect) {
                // Even if locations couldn't be updated, try to update colors for selected type and current location
                if (locationSelect) {
                    const selectedPlaceId = locationTrigger.dataset.id;
                    updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect);
                }
            }

            updateItemTotal(cartItem);
            updateCartSummary();

            // Update data in localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }

    // Location change handler
    const locationSelect = brandingItem.querySelector('.branding-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function () {
            const typeDropdown = brandingItem.querySelector('.branding-field-type');
            const typeTrigger = typeDropdown?.querySelector('.viki-dropdown__trigger');
            const colorsSelect = brandingItem.querySelector('.branding-colors');
            const locationDropdown = locationSelect.closest('.viki-dropdown');
            const locationTrigger = locationDropdown.querySelector('.viki-dropdown__trigger');

            if (goodsId && typeTrigger && colorsSelect) {
                const opportunities = printOpportunitiesCache.get(goodsId) || [];
                const selectedTypeId = typeTrigger.dataset.id;
                const selectedPlaceId = locationTrigger.dataset.id;

                // Update color options - always for selected type/place,
                // regardless of whether this option is available for other elements
                updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect);

                // Update available locations for all elements in this container
                updateAllLocationOptionsInContainer(brandingContainer, goodsId);
                
                // After updating all locations, also update all color options 
                // for other branding items based on their current type and location
                const allBrandingItems = brandingContainer.querySelectorAll('.branding-item');
                allBrandingItems.forEach(item => {
                    if (item !== brandingItem) { // Skip the current item that triggered the change
                        const itemTypeDropdown = item.querySelector('.branding-field-type');
                        const itemTypeTrigger = itemTypeDropdown?.querySelector('.viki-dropdown__trigger');
                        const itemLocationDropdown = item.querySelector('.branding-field-location');
                        const itemLocationTrigger = itemLocationDropdown?.querySelector('.viki-dropdown__trigger');
                        const itemColorsSelect = item.querySelector('.branding-colors');
                        
                        if (itemTypeTrigger && itemLocationTrigger && itemColorsSelect && 
                            itemTypeTrigger.dataset.id && itemLocationTrigger.dataset.id) {
                            updateColorsOptions(
                                opportunities, 
                                itemTypeTrigger.dataset.id, 
                                itemLocationTrigger.dataset.id, 
                                itemColorsSelect
                            );
                        }
                    }
                });
            }

            updateItemTotal(cartItem);
            updateCartSummary();

            // Update data in localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }

    // Color count change handler
    const colorsSelect = brandingItem.querySelector('.branding-colors');
    if (colorsSelect) {
        colorsSelect.addEventListener('change', function () {
            updateItemTotal(cartItem);
            updateCartSummary();

            // Update data in localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }

    // Price change handler
    const priceInput = brandingItem.querySelector('.branding-price');
    if (priceInput) {
        priceInput.addEventListener('change', function () {
            if (parseFloat(this.value) < 0) {
                this.value = 0;
            }
            updateItemTotal(cartItem);
            updateCartSummary();

            // Update data in localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }

    // Second pass checkbox handler
    const secondPassCheckbox = brandingItem.querySelector('.branding-second-pass');
    if (secondPassCheckbox) {
        secondPassCheckbox.addEventListener('change', function () {
            updateItemTotal(cartItem);
            updateCartSummary();

            // Update data in localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }
} 