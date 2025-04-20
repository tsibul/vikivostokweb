/**
 * Module for branding functionality in cart
 */

import { updateCartSummary } from './summary.js';
import { updateItemTotal } from './calculation.js';
import { updateBrandingItem } from './brandingItem.js';
import { createBrandingItem, checkAndUpdateAddBrandingButton, updateCartBrandingInLocalStorage } from './brandingHelpers.js';
import { printOpportunitiesCache, getBrandingCountByTypeAndPlace } from './brandingCommon.js';
import { formatPrice } from './utils.js';

/**
 * Initializes branding functionality
 */
export function initBranding() {
    // Loading print capabilities data for all products in cart
    const cartItems = document.querySelectorAll('.cart-item');
    const goodsIdsToFetch = new Set();
    
    cartItems.forEach(item => {
        const addBrandingBtn = item.querySelector('.branding-add-btn');
        if (addBrandingBtn && addBrandingBtn.dataset.goodsId) {
            const goodsId = addBrandingBtn.dataset.goodsId;
            goodsIdsToFetch.add(goodsId);
        }
    });
    
    // Load printing data for all products in cart
    Promise.all(
        Array.from(goodsIdsToFetch).map(goodsId => 
            fetchPrintOpportunities(goodsId)
        )
    ).then(() => {
        // Check availability of branding and manage buttons
        cartItems.forEach(item => {
            const addBrandingBtn = item.querySelector('.branding-add-btn');
            if (addBrandingBtn && addBrandingBtn.dataset.goodsId) {
                const goodsId = addBrandingBtn.dataset.goodsId;
                const opportunities = printOpportunitiesCache.get(goodsId) || [];
                
                // Disable button only if there are no printing capabilities
                if (!opportunities || opportunities.length === 0) {
                    addBrandingBtn.disabled = true;
                    addBrandingBtn.title = 'Нет данных о возможностях нанесения для этого товара';
                    addBrandingBtn.classList.add('disabled');
                } else {
                    // Check availability of branding locations
                    const brandingContainer = item.querySelector('.branding-items');

                    // Update options for existing branding elements
                    const brandingItems = brandingContainer.querySelectorAll('.branding-item');
                    brandingItems.forEach(brandingItem => {
                        const typeSelect = brandingItem.querySelector('.branding-type');
                        const locationSelect = brandingItem.querySelector('.branding-location');
                        const colorsSelect = brandingItem.querySelector('.branding-colors');

                        if (typeSelect && locationSelect && colorsSelect) {
                            // Update options for each select
                            updateAllLocationOptionsInContainer(brandingContainer, goodsId);

                            // Update color options for current type and location combination
                            if (typeSelect.value && locationSelect) {
                                const locationTrigger = locationSelect.closest('.viki-dropdown')?.querySelector('.viki-dropdown__trigger');
                                if (locationTrigger && locationTrigger.dataset.id) {
                                    updateColorsOptions(opportunities, typeSelect.value, locationTrigger.dataset.id, colorsSelect);
                                }
                            }
                        }
                    });

                    checkAndUpdateAddBrandingButton(addBrandingBtn, goodsId, brandingContainer);
                }
            }
            
            // Initialize branding prices
            updateBrandingPrices(item);
            
            // Get item cost
            const itemTotalInput = item.querySelector('.cart-item__total-price-input');
            let itemTotal = 0;
            
            if (itemTotalInput) {
                itemTotal = parseFloat(itemTotalInput.value);
            } else {
                // For backward compatibility check old format
                const itemTotalText = item.querySelector('.cart-item__total-price')?.textContent;
                if (itemTotalText) {
                    itemTotal = parseFloat(itemTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
                }
            }
            
            // Update final item cost with branding
            updateItemFinalTotal(item, itemTotal);
        });
        
        // Add handlers for all branding add buttons
        attachAddBrandingHandlers();

        // Initialize handlers for existing branding elements
        const brandingItems = document.querySelectorAll('.branding-item');
        brandingItems.forEach(item => {
            updateBrandingItem(item);
        });
        
        // Initialize dropdowns
        initDropdowns();
    });
}

/**
 * Initializes all dropdown elements on the page
 */
export function initDropdowns() {
    // Add global click handler to close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.viki-dropdown')) {
            document.querySelectorAll('.viki-dropdown--open').forEach(dropdown => {
                dropdown.classList.remove('viki-dropdown--open');
            });
        }
    });
    
    // Initialize all dropdown triggers that aren't within branding items
    // (those are handled in updateBrandingItem function)
    const dropdownTriggers = document.querySelectorAll('.viki-dropdown__trigger');
    dropdownTriggers.forEach(trigger => {
        // Skip triggers inside branding items as they're handled separately
        if (!trigger.closest('.branding-item')) {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                const dropdown = this.closest('.viki-dropdown');

                // Close all other open dropdowns
                document.querySelectorAll('.viki-dropdown').forEach(openDropdown => {
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove('viki-dropdown--open');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('viki-dropdown--open');
            });
        }
    });
}

/**
 * Attaches event handlers to branding add buttons
 */
export function attachAddBrandingHandlers() {
    // First remove all existing handlers
    const allButtons = document.querySelectorAll('.branding-add-btn');
    allButtons.forEach(button => {
        // Clone button to remove all handlers
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });

    // Now add new handlers only to non-disabled buttons
    const addBrandingButtons = document.querySelectorAll('.branding-add-btn:not([disabled])');
    addBrandingButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemArticle = this.dataset.item;
            const goodsId = this.dataset.goodsId;
            const brandingContainer = this.closest('.cart-item__branding').querySelector('.branding-items');
            const brandingCount = brandingContainer.querySelectorAll('.branding-item').length;
            
            // Create new branding element with restrictions
            const newBrandingItem = createBrandingItem(itemArticle, goodsId, brandingCount + 1, brandingContainer);
            
            // Check if the branding item was created successfully with locations
            if (!newBrandingItem || !newBrandingItem.querySelector('.branding-item__row')) {
                // If no valid branding item was created, disable button
                this.disabled = true;
                this.title = 'Достигнут лимит для всех мест нанесения';
                this.classList.add('disabled');
                return;
            }
            
            // Check for available locations
            const locationDropdown = newBrandingItem.querySelector('.branding-field-location');
            const locationUl = locationDropdown?.querySelector('.branding-location');
            const hasLocations = locationUl && locationUl.querySelector('li');
            
            if (!hasLocations) {
                // If no locations available, don't add element and disable button
                this.disabled = true;
                this.title = 'Достигнут лимит для всех мест нанесения';
                this.classList.add('disabled');
                return;
            }
            
            brandingContainer.appendChild(newBrandingItem);
            
            // Initialize handlers for new element
            updateBrandingItem(newBrandingItem);
            
            // Add explicit handlers for dropdowns in the new item
            const locationItems = newBrandingItem.querySelectorAll('.branding-location li');
            const colorItems = newBrandingItem.querySelectorAll('.branding-colors li');
            
            locationItems.forEach(item => {
                if (locationUl) {
                    attachDropdownItemHandler(item, locationUl);
                }
            });
            
            colorItems.forEach(item => {
                const colorsList = item.closest('.viki-dropdown')?.querySelector('.branding-colors');
                if (colorsList) {
                    attachDropdownItemHandler(item, colorsList);
                }
            });
            
            // Update cost
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
            
            // Check if another branding can be added
            checkAndUpdateAddBrandingButton(this, goodsId, brandingContainer);
            
            // Update data in localStorage
            updateCartBrandingInLocalStorage(this.closest('.cart-item'));
        });
    });
}

/**
 * Updates branding prices for a cart item
 * @param {HTMLElement} cartItem - Cart item element
 */
export function updateBrandingPrices(cartItem) {
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    const brandingItems = cartItem.querySelectorAll('.branding-item');
    let brandingTotal = 0;
    
    brandingItems.forEach(item => {
        // Get branding price
        const priceInput = item.querySelector('.branding-price');
        const pricePerItem = parseFloat(priceInput.value);
        
        // Calculate branding cost for all items
        const secondPass = item.querySelector('.branding-second-pass').checked;
        
        // Get colors from dropdown structure - first try the data-id on trigger, then fallback to li value
        let colors = 1; // Default to 1 color
        const colorsDropdown = item.querySelector('.branding-colors');
        const colorsTrigger = colorsDropdown?.closest('.viki-dropdown')?.querySelector('.viki-dropdown__trigger');
        
        if (colorsTrigger && colorsTrigger.dataset.id) {
            colors = parseInt(colorsTrigger.dataset.id);
        } else {
            // Fallback to old structure
            const colorsLi = colorsDropdown?.querySelector('li');
            if (colorsLi) {
                colors = parseInt(colorsLi.getAttribute('value'));
            }
        }
        
        // Multiplier based on number of colors
        let colorMultiplier = 1;
        if (!isNaN(colors)) {
            // Increase price by 20% for each additional color
            colorMultiplier = 1 + (colors - 1) * 0.2;
        }
        
        // If second pass is selected, increase price by 30%
        const secondPassMultiplier = secondPass ? 1.3 : 1;
        
        // Final branding price
        const totalPrice = pricePerItem * quantity * colorMultiplier * secondPassMultiplier;
        brandingTotal += totalPrice;
        
        // Update branding price display
        const brandingTotalPriceInput = item.querySelector('.branding-total-price-input');
        if (brandingTotalPriceInput) {
            brandingTotalPriceInput.value = totalPrice.toFixed(2);
        } else {
            // For backward compatibility
            const brandingTotalPrice = item.querySelector('.branding-total-price');
            if (brandingTotalPrice) {
                brandingTotalPrice.textContent = formatPrice(totalPrice.toFixed(0)) + ' руб.';
            }
        }
    });
    
    // Update total branding cost
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    if (brandingSubtotalInput) {
        brandingSubtotalInput.value = brandingTotal.toFixed(2);
    } else {
        // For backward compatibility
        const brandingSubtotal = cartItem.querySelector('.branding-subtotal-price');
        if (brandingSubtotal) {
            brandingSubtotal.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
        }
    }
    
    return brandingTotal;
}

/**
 * Updates the final total price for a cart item including branding
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} itemTotal - Item total without branding
 */
export function updateItemFinalTotal(cartItem, itemTotal) {
    // Get branding total
    let brandingTotal = 0;
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    
    if (brandingSubtotalInput) {
        brandingTotal = parseFloat(brandingSubtotalInput.value);
    } else {
        // For backward compatibility
        const brandingTotalText = cartItem.querySelector('.branding-subtotal-price')?.textContent;
        if (brandingTotalText) {
            brandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Calculate final total
    const finalTotal = itemTotal + brandingTotal;
    
    // Update final total display
    const finalTotalInput = cartItem.querySelector('.cart-item__final-total-price-input');
    if (finalTotalInput) {
        finalTotalInput.value = finalTotal.toFixed(2);
    } else {
        // For backward compatibility
        const finalTotalElement = cartItem.querySelector('.cart-item__final-total-price');
        if (finalTotalElement) {
            finalTotalElement.textContent = formatPrice(finalTotal.toFixed(0)) + ' руб.';
        }
    }
}

/**
 * Updates location options for all elements in container
 * @param {HTMLElement} brandingContainer - Container with branding elements
 * @param {string} goodsId - Product ID
 */
export function updateAllLocationOptionsInContainer(brandingContainer, goodsId) {
    if (!brandingContainer) return;

    const brandingItems = brandingContainer.querySelectorAll('.branding-item');
    const opportunities = printOpportunitiesCache.get(goodsId) || [];

    // If no available brandings or elements, just exit
    if (!opportunities.length || !brandingItems.length) return;

    // First collect information about current selected values for each element
    const selectedValues = [];
    brandingItems.forEach(item => {
        const typeSelect = item.querySelector('.branding-type');
        const locationField = item.querySelector('.branding-field-location');
        const locationTrigger = locationField?.querySelector('.viki-dropdown__trigger');

        if (typeSelect && locationTrigger && typeSelect.value && locationTrigger.dataset.id) {
            selectedValues.push({
                item: item,
                typeId: typeSelect.value,
                locationId: locationTrigger.dataset.id
            });
        }
    });

    // Get unique print types for all elements
    const printTypes = Array.from(new Set(opportunities.map(op => op.print_type_id)))
        .map(typeId => {
            const op = opportunities.find(o => o.print_type_id === typeId);
            return {
                id: typeId,
                name: op ? op.print_type_name : 'Неизвестный тип'
            };
        });

    // Update options for each type select (refill them)
    selectedValues.forEach((selection, index) => {
        const item = selection.item;
        const typeSelect = item.querySelector('.branding-type');
        if (typeSelect) {
            // Save current selected value
            const currentTypeId = typeSelect.value;

            // Clear current options
            typeSelect.innerHTML = '';

            // Add options for print types
            printTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                typeSelect.appendChild(option);
            });

            // Restore selected value if still available
            if (printTypes.some(type => type.id === currentTypeId)) {
                typeSelect.value = currentTypeId;
            }
        }
    });

    // Create temporary container to check location availability
    const tempContainer = document.createElement('div');

    // Now update location options for each element
    selectedValues.forEach((selection, index) => {
        const item = selection.item;

        // For each element we need to know which locations are occupied by other elements
        // So create temporary container with other elements
        tempContainer.innerHTML = '';

        selectedValues.forEach((sel, i) => {
            if (i !== index) {
                const tempItem = document.createElement('div');
                tempItem.className = 'branding-item';
                
                // Create temp elements with proper structure for getBrandingCountByTypeAndPlace to work
                tempItem.innerHTML = `
                    <div class="branding-item__row">
                        <div class="branding-field branding-field-type">
                            <select class="branding-type" value="${sel.typeId}">
                                <option value="${sel.typeId}" selected></option>
                            </select>
                        </div>
                        <div class="branding-field branding-field-location viki-dropdown">
                            <div class="viki-dropdown__trigger" data-id="${sel.locationId}"></div>
                            <ul class="viki-dropdown__menu viki-dropdown__menu-list branding-location" data-value="${sel.locationId}"></ul>
                        </div>
                    </div>
                `;
                tempContainer.appendChild(tempItem);
            }
        });

        const typeSelect = item.querySelector('.branding-type');
        const locationField = item.querySelector('.branding-field-location');
        const locationSelect = locationField?.querySelector('.branding-location');

        if (typeSelect && locationSelect && typeSelect.value) {
            // Get the selected location ID from the dropdown trigger
            const locationTrigger = locationField.querySelector('.viki-dropdown__trigger');
            
            // Consider current branding state for proper update
            const currentConfig = {
                typeId: typeSelect.value,
                locationId: locationTrigger?.dataset.id || ''
            };

            // Update location options considering other elements
            updateLocationOptions(opportunities, typeSelect.value, locationSelect, tempContainer);

            // If after update there are no available locations, try to find another type with available locations
            if (locationSelect.querySelectorAll('li').length === 0) {
                // Try all types looking for available location
                for (const type of printTypes) {
                    if (type.id === typeSelect.value) continue; // Skip current type

                    typeSelect.value = type.id;
                    updateLocationOptions(opportunities, type.id, locationSelect, tempContainer);

                    // If found type with available locations
                    if (locationSelect.querySelectorAll('li').length > 0) {
                        break;
                    }
                }
            }
        }

        // Regardless of availability of new locations, always update color options
        // If current type and location combination is allowed (i.e. already occupied by this branding),
        // we should preserve color selection options
        const colorsSelect = item.querySelector('.branding-colors');
        const locationDropdown = item.querySelector('.branding-field-location');
        const locationTrigger = locationDropdown?.querySelector('.viki-dropdown__trigger');
        
        if (colorsSelect && typeSelect && locationTrigger && 
            typeSelect.value && locationTrigger.dataset.id) {
            updateColorsOptions(opportunities, typeSelect.value, locationTrigger.dataset.id, colorsSelect);
        }
    });
}

/**
 * Attach click handlers to dropdown items
 * @param {HTMLElement} option - The dropdown li element
 * @param {HTMLElement} dropdownList - The dropdown list (ul element)
 */
function attachDropdownItemHandler(option, dropdownList) {
    option.addEventListener('click', function() {
        const dropdown = this.closest('.viki-dropdown');
        if (!dropdown) return;
        
        const trigger = dropdown.querySelector('.viki-dropdown__trigger');
        if (!trigger) return;
        
        // Update trigger text and data
        trigger.textContent = this.textContent;
        trigger.dataset.id = this.getAttribute('value');
        
        // Also set data-value on the ul element for compatibility
        if (dropdownList) {
            dropdownList.dataset.value = this.getAttribute('value');
        }
        
        // Add back the icon
        const icon = document.createElement('span');
        icon.className = 'viki-dropdown__trigger-icon';
        icon.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        trigger.appendChild(icon);
        
        // Close dropdown
        dropdown.classList.remove('viki-dropdown--open');
        
        // Create and dispatch a change event
        const changeEvent = new Event('change', { bubbles: true });
        if (dropdownList) {
            dropdownList.dispatchEvent(changeEvent);
        }
    });
}

/**
 * Updates location options based on selected type
 * @param {Array} opportunities - Print opportunities
 * @param {string} selectedTypeId - Selected print type ID
 * @param {HTMLElement} locationSelect - Location dropdown menu (ul element)
 * @param {HTMLElement} brandingContainer - Container with brandings for limit checking
 */
export function updateLocationOptions(opportunities, selectedTypeId, locationSelect, brandingContainer) {
    if (!locationSelect) return;
    
    // Filter locations by selected type
    const availablePlaces = opportunities.filter(op => op.print_type_id == selectedTypeId);
    
    // Get dropdown container and trigger element
    const dropdownContainer = locationSelect.closest('.viki-dropdown');
    if (!dropdownContainer) return;
    
    const dropdownTrigger = dropdownContainer.querySelector('.viki-dropdown__trigger');
    if (!dropdownTrigger) return;
    
    // Save current selected value
    const currentValue = dropdownTrigger.dataset.id;
    
    // Clear current options
    locationSelect.innerHTML = '';
    
    // Get current branding count by type and location
    const brandingByTypeAndPlace = getBrandingCountByTypeAndPlace(brandingContainer);
    
    // Track the first available option for dropdown
    let firstOption = null;
    
    // Add new options only if limit not exceeded for location
    availablePlaces.forEach(place => {
        const key = selectedTypeId + '-' + place.print_place_id;
        const currentCount = brandingByTypeAndPlace.get(key) || 0;
        
        // Add option only if branding count doesn't exceed limit
        if (currentCount < place.place_quantity) {
            // Create li element for dropdown
            const option = document.createElement('li');
            option.setAttribute('value', place.print_place_id);
            option.textContent = place.print_place_name;
            locationSelect.appendChild(option);
            
            // Add click handler for newly created option
            attachDropdownItemHandler(option, locationSelect);
            
            // Save first option
            if (!firstOption) {
                firstOption = {
                    value: place.print_place_id,
                    text: place.print_place_name
                };
            }
        }
    });
    
    // Check if current selected value is still available
    const selectedLi = Array.from(locationSelect.querySelectorAll('li'))
        .find(li => li.getAttribute('value') === currentValue);
    
    // If there are no available places, return early
    if (locationSelect.querySelectorAll('li').length === 0) {
        // Clear the dropdown trigger
        dropdownTrigger.textContent = "Нет доступных мест";
        dropdownTrigger.dataset.id = "";
        locationSelect.dataset.value = "";
        return;
    }
    
    // Handle selection and UI update
    if (selectedLi) {
        // The current value is still available
        locationSelect.dataset.value = currentValue;
        
        // Update trigger display
        dropdownTrigger.textContent = selectedLi.textContent;
        dropdownTrigger.dataset.id = currentValue;
    } else if (firstOption) {
        // Current value not available, use first option
        locationSelect.dataset.value = firstOption.value;
        
        // Update trigger display
        dropdownTrigger.textContent = firstOption.text;
        dropdownTrigger.dataset.id = firstOption.value;
    }
    
    // Add back the icon
    const icon = document.createElement('span');
    icon.className = 'viki-dropdown__trigger-icon';
    icon.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    dropdownTrigger.appendChild(icon);
}

/**
 * Updates color options based on selected type and location
 * @param {Array} opportunities - Print opportunities
 * @param {string} selectedTypeId - Selected print type ID
 * @param {string} selectedPlaceId - Selected location ID
 * @param {HTMLElement} colorsSelect - Colors select element
 */
export function updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect) {
    if (!colorsSelect) return;
    
    // Find corresponding print opportunity
    const opportunity = opportunities.find(op => 
        op.print_type_id == selectedTypeId && op.print_place_id == selectedPlaceId
    );
    
    // If no data about print opportunities for this combination, exit
    if (!opportunity) {
        return;
    }
    
    // Get dropdown container and trigger
    const dropdownContainer = colorsSelect.closest('.viki-dropdown');
    if (!dropdownContainer) return;
    
    const dropdownTrigger = dropdownContainer.querySelector('.viki-dropdown__trigger');
    if (!dropdownTrigger) return;
    
    // Save current selected value
    const currentValue = dropdownTrigger.dataset.id;
    
    // Clear current options
    colorsSelect.innerHTML = '';
    
    // Add options based on maximum number of colors
    for (let i = 1; i <= opportunity.color_quantity; i++) {
        const option = document.createElement('li');
        option.setAttribute('value', i);
        option.textContent = i === 1 ? '1 цвет' : 
                            (i > 1 && i < 5) ? i + ' цвета' : 
                            i + ' цветов';
        colorsSelect.appendChild(option);
        
        // Add click handler for newly created option
        attachDropdownItemHandler(option, colorsSelect);
    }
    
    // If there are no color options, exit
    if (colorsSelect.querySelectorAll('li').length === 0) {
        // Clear the dropdown trigger
        dropdownTrigger.textContent = "Нет доступных цветов";
        dropdownTrigger.dataset.id = "";
        colorsSelect.dataset.value = "";
        return;
    }
    
    // Set 'value' property for compatibility with existing code
    const selectedLi = Array.from(colorsSelect.querySelectorAll('li'))
        .find(li => li.getAttribute('value') === currentValue);
    
    if (selectedLi && !isNaN(parseInt(currentValue)) && parseInt(currentValue) <= opportunity.color_quantity) {
        // Current value is still available
        colorsSelect.dataset.value = currentValue;
        
        // Update trigger display
        dropdownTrigger.textContent = selectedLi.textContent;
        dropdownTrigger.dataset.id = currentValue;
    } else if (colorsSelect.querySelectorAll('li').length > 0) {
        // Current value not available, use first option
        const firstOption = colorsSelect.querySelector('li');
        colorsSelect.dataset.value = firstOption.getAttribute('value');
        
        // Update trigger display
        dropdownTrigger.textContent = firstOption.textContent;
        dropdownTrigger.dataset.id = firstOption.getAttribute('value');
    }
    
    // Add back the icon
    const icon = document.createElement('span');
    icon.className = 'viki-dropdown__trigger-icon';
    icon.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    dropdownTrigger.appendChild(icon);
}

/**
 * Loads print opportunities for product
 * @param {string} goodsId - Product ID
 * @return {Promise} - Promise with print opportunities data
 */
export async function fetchPrintOpportunities(goodsId) {
    if (printOpportunitiesCache.has(goodsId)) {
        return printOpportunitiesCache.get(goodsId);
    }
    
    try {
        const response = await fetch(`/api/print-opportunities/${goodsId}`);
        const data = await response.json();
        
        if (data.success && data.opportunities) {
            printOpportunitiesCache.set(goodsId, data.opportunities);
            return data.opportunities;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
} 