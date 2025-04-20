/**
 * Module for branding helper functions
 */

import { printOpportunitiesCache, getBrandingCountByTypeAndPlace } from './brandingCommon.js';

/**
 * Creates a branding element
 * @param {string} itemArticle - Product article
 * @param {string} goodsId - Product ID
 * @param {number} index - Branding number
 * @param {HTMLElement} brandingContainer - Container with brandings for checking limits
 * @return {HTMLElement} - New branding element
 */
export function createBrandingItem(itemArticle, goodsId, index, brandingContainer) {
    const div = document.createElement('div');
    div.className = 'branding-item';
    
    // Get print opportunities
    const opportunities = printOpportunitiesCache.get(goodsId) || [];
    
    // If no data about print opportunities, return empty element
    if (!opportunities || opportunities.length === 0) {
        return div;
    }
    
    // Get unique print types
    const printTypes = Array.from(new Set(opportunities.map(op => op.print_type_id)))
        .map(typeId => {
            const op = opportunities.find(o => o.print_type_id === typeId);
            return {
                id: typeId,
                name: op ? op.print_type_name : 'Неизвестный тип'
            };
        });
    
    // Create options for print types
    let typeOptions = '';
    printTypes.forEach(type => {
        typeOptions += `<option value="${type.id}">${type.name}</option>`;
    });
    
    // Temporarily create div without content to get branding information
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `<select class="branding-type" value="${printTypes.length > 0 ? printTypes[0].id : ''}"></select>`;
    div.appendChild(tempDiv);
    
    // Get current data about branding count
    const brandingByTypeAndPlace = getBrandingCountByTypeAndPlace(brandingContainer);
    
    // Determine first available print type and its locations
    let firstAvailableType = '';
    let locationOptions = '';
    let defaultPrice = 450;
    
    // For print location initially take options for first available type
    if (printTypes.length > 0) {
        // Check each print type for available locations
        for (const type of printTypes) {
            const placesForType = opportunities.filter(op => op.print_type_id == type.id);
            const availablePlaces = placesForType.filter(place => {
                const key = type.id + '-' + place.print_place_id;
                const currentCount = brandingByTypeAndPlace.get(key) || 0;
                return currentCount < place.place_quantity;
            });
            
            if (availablePlaces.length > 0) {
                firstAvailableType = type.id;
                
                // Create options for available locations
                availablePlaces.forEach(place => {
                    locationOptions += `<option value="${place.print_place_id}">${place.print_place_name}</option>`;
                });
                
                // Set approximate cost based on print size
                const size = availablePlaces[0].length * availablePlaces[0].height;
                if (size < 2500) {
                    defaultPrice = 350;
                } else if (size < 10000) {
                    defaultPrice = 450;
                } else {
                    defaultPrice = 550;
                }
                
                break;
            }
        }
    }
    
    // Remove temporary div
    div.removeChild(tempDiv);
    
    // If no available locations, return empty element
    if (!firstAvailableType || locationOptions === '') {
        return div;
    }
    
    // Create options for number of colors - now for first selected type and location
    let colorOptions = '';
    
    // Find first available location for selected type
    const selectedPlaceId = locationOptions.match(/value="([^"]+)"/)?.[1];
    if (selectedPlaceId) {
        const selectedOpportunity = opportunities.find(op => 
            op.print_type_id == firstAvailableType && op.print_place_id == selectedPlaceId
        );
        
        if (selectedOpportunity) {
            const maxColors = selectedOpportunity.color_quantity;
            
            for (let i = 1; i <= maxColors; i++) {
                const colorText = i === 1 ? '1 цвет' : 
                                (i > 1 && i < 5) ? i + ' цвета' : 
                                i + ' цветов';
                colorOptions += `<li value="${i}">${colorText}</li>`;
            }
            
            }
        }
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<ul>${colorOptions}</ul>`, 'text/html');
    const firstColor = doc.querySelector('li')
    
    // Parse locationOptions to get the list items and first selected value
    const locationOptionsParser = new DOMParser();
    const locationDoc = locationOptionsParser.parseFromString(`<select>${locationOptions}</select>`, 'text/html');
    const locationSelectOptions = locationDoc.querySelectorAll('option');
    let firstLocation = null;
    if (locationSelectOptions.length > 0) {
        firstLocation = {
            value: locationSelectOptions[0].value,
            text: locationSelectOptions[0].textContent
        };
    }
    
    // Convert options to list items for dropdown
    let locationListItems = '';
    locationSelectOptions.forEach(option => {
        locationListItems += `<li value="${option.value}">${option.textContent}</li>`;
    });
    
    // Create element
    div.innerHTML = `
        <div class="branding-item__row">
            <div class="branding-field branding-field-type">
                <select class="branding-type" data-goods-id="${goodsId}">
                    ${typeOptions}
                </select>
            </div>
            <div class="branding-field branding-field-location viki-dropdown">
                <div class="viki-dropdown__trigger" data-id="${firstLocation ? firstLocation.value : ''}">
                    ${firstLocation ? firstLocation.text : ''}
                    <span class="viki-dropdown__trigger-icon">
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                </div>
                <ul class="viki-dropdown__menu viki-dropdown__menu-list branding-location" data-value="${firstLocation ? firstLocation.value : ''}">
                    ${locationListItems}
                </ul>
            </div>
            <div class="branding-field branding-field-colors viki-dropdown">
                <div class="viki-dropdown__trigger" data-id="${firstColor.value}">
                    ${firstColor.textContent}
                    <span class="viki-dropdown__trigger-icon">
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                </div>
                <ul class="viki-dropdown__menu viki-dropdown__menu-list branding-colors">
                    ${colorOptions}
                </ul>
            </div>
            <div class="branding-field branding-checkbox">
                <input type="checkbox" id="second-pass-${itemArticle}-${index}" class="branding-second-pass">
                <label for="second-pass-${itemArticle}-${index}">2й проход</label>
            </div>
            <div class="branding-field branding-field-price">
                <input type="number" class="branding-price" value="${defaultPrice}" min="0">
                <span class="currency">руб.</span>
            </div>
            <div class="branding-field branding-field-total">
                <div class="price-container">
                    <input type="number" class="branding-total-price-input text-like" value="0.00" readonly>
                    <span class="currency">руб.</span>
                </div>
            </div>
            <div class="branding-field branding-field-actions">
                <button class="branding-remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // Set initial print type value
    const typeSelectElement = div.querySelector('.branding-type');
    if (typeSelectElement) {
        typeSelectElement.value = firstAvailableType;
    }
    
    return div;
}

/**
 * Checks if another branding can be added and updates button state
 * @param {HTMLElement} addButton - Add branding button
 * @param {string} goodsId - Product ID
 * @param {HTMLElement} brandingContainer - Container with brandings
 */
export function checkAndUpdateAddBrandingButton(addButton, goodsId, brandingContainer) {
    const opportunities = printOpportunitiesCache.get(goodsId) || [];
    
    // If no data about print opportunities, disable button
    if (!opportunities || opportunities.length === 0) {
        addButton.disabled = true;
        addButton.title = 'Нет данных о возможностях нанесения для этого товара';
        addButton.classList.add('disabled');
        return;
    }
    
    // Get information about current brandings
    const brandingByTypeAndPlace = getBrandingCountByTypeAndPlace(brandingContainer);
    
    // Check if there is at least one available type and location combination
    let hasAvailablePlace = false;
    
    for (const typeId of new Set(opportunities.map(op => op.print_type_id))) {
        const placesForType = opportunities.filter(op => op.print_type_id == typeId);
        
        for (const place of placesForType) {
            const key = typeId + '-' + place.print_place_id;
            const currentCount = brandingByTypeAndPlace.get(key) || 0;
            
            if (currentCount < place.place_quantity) {
                hasAvailablePlace = true;
                break;
            }
        }
        
        if (hasAvailablePlace) break;
    }
    
    // Update button state
    if (!hasAvailablePlace) {
        addButton.disabled = true;
        addButton.title = 'Достигнут лимит для всех мест нанесения';
        addButton.classList.add('disabled');
    } else {
        addButton.disabled = false;
        addButton.title = '';
        addButton.classList.remove('disabled');
    }
}

/**
 * Updates branding data in localStorage
 * @param {HTMLElement} cartItem - Cart item element
 */
export function updateCartBrandingInLocalStorage(cartItem) {
    const removeButton = cartItem.querySelector('.cart-item__remove');
    if (!removeButton || !removeButton.dataset.id) return;
    
    const itemId = removeButton.dataset.id;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id == itemId);
    
    if (itemIndex === -1) return;
    
    // Collect branding data
    const brandingItems = cartItem.querySelectorAll('.branding-item');
    const brandings = [];
    
    brandingItems.forEach(item => {
        const typeSelect = item.querySelector('.branding-type');
        const locationField = item.querySelector('.branding-field-location');
        const colorsField = item.querySelector('.branding-field-colors');
        const secondPassCheckbox = item.querySelector('.branding-second-pass');
        const priceInput = item.querySelector('.branding-price');
        
        if (typeSelect && locationField && colorsField && priceInput) {
            // Get location from dropdown
            const locationTrigger = locationField.querySelector('.viki-dropdown__trigger');
            let locationId = locationTrigger.dataset.id;
            let locationText = locationTrigger.textContent.trim();
            
            // Remove any child elements text (like the dropdown icon)
            const tempSpan = document.createElement('span');
            tempSpan.innerHTML = locationText;
            locationText = tempSpan.textContent.trim();
            
            // Get colors from dropdown
            const colorsTrigger = colorsField.querySelector('.viki-dropdown__trigger');
            let colorsValue = colorsTrigger.dataset.id;
            
            brandings.push({
                type: typeSelect.options[typeSelect.selectedIndex]?.textContent || typeSelect.value,
                type_id: typeSelect.value,
                location: locationText,
                location_id: locationId,
                colors: parseInt(colorsValue) || 1,
                secondPass: secondPassCheckbox ? secondPassCheckbox.checked : false,
                price: parseFloat(priceInput.value) || 0
            });
        }
    });
    
    // Update data in localStorage
    cart[itemIndex].branding = brandings;
    localStorage.setItem('cart', JSON.stringify(cart));
} 