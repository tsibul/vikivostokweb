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

    // Initialize dropdown functionality
    const dropdownTrigger = brandingItem.querySelector('.viki-dropdown__trigger');
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', function(e) {
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

        // Handle dropdown menu item clicks
        const dropdownItems = brandingItem.querySelectorAll('.branding-colors li');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const dropdown = this.closest('.viki-dropdown');
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

                // Trigger change event to update calculations
                const changeEvent = new Event('change');
                brandingItem.querySelector('.branding-colors').dispatchEvent(changeEvent);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.viki-dropdown')) {
                document.querySelectorAll('.viki-dropdown--open').forEach(dropdown => {
                    dropdown.classList.remove('viki-dropdown--open');
                });
            }
        });
    }

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
            const locationSelect = brandingItem.querySelector('.branding-location');
            const colorsSelect = brandingItem.querySelector('.branding-colors');
            const selectedTypeId = this.value;

            // Update location options
            if (goodsId && locationSelect) {
                // Clear current location options
                updateLocationOptions(opportunities, selectedTypeId, locationSelect, brandingContainer);

                // After updating location also update color count
                if (locationSelect.options.length > 0 && colorsSelect) {
                    updateColorsOptions(opportunities, selectedTypeId, locationSelect.value, colorsSelect);
                }
            } else if (colorsSelect) {
                // Even if locations couldn't be updated, try to update colors for selected type and current location
                if (locationSelect && locationSelect.value) {
                    updateColorsOptions(opportunities, selectedTypeId, locationSelect.value, colorsSelect);
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
            const typeSelect = brandingItem.querySelector('.branding-type');
            const colorsSelect = brandingItem.querySelector('.branding-colors');

            if (goodsId && typeSelect && colorsSelect) {
                const opportunities = printOpportunitiesCache.get(goodsId) || [];
                const selectedTypeId = typeSelect.value;
                const selectedPlaceId = this.value;

                // Update color options - always for selected type/place,
                // regardless of whether this option is available for other elements
                updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect);

                // Update available locations for all elements
                updateAllLocationOptionsInContainer(brandingContainer, goodsId);
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