/**
 * Branding Add Module
 * Handles adding new branding to cart items
 */

import eventBus from '../eventBus.js';
import { updateCartItemBranding } from '../cartStorage.js';
import { 
    fetchPrintOpportunities, 
    getUniqueTypes, 
    getLocationsForType,
    getColorsForTypeAndLocation,
    getBrandingPrice,
    isLocationAvailable
} from './brandingOptionsManager.js';

/**
 * Initialize branding add functionality
 */
export function initBrandingAdd() {
    document.addEventListener('click', handleBrandingAddClick);
}

/**
 * Handle clicks on "Add branding" buttons
 * @param {MouseEvent} event - Click event
 */
async function handleBrandingAddClick(event) {
    // Check if the click is on a canvas
    if (event.target.classList.contains('cart-item-canvas')) {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate click position in canvas coordinates
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Check if the click is in the "Add branding" area (when no branding exists)
        const itemId = canvas.dataset.itemId;
        if (!itemId) return;
        
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cartItems.find(item => item.id === itemId);
        
        if (!item) return;
        
        // If item has no branding, check if click is in the add branding area
        if (!item.branding || item.branding.length === 0) {
            const imageSize = 70; // This should match the CONFIG.imageSize in cartItemRenderer.js
            const padding = 16;   // This should match the CONFIG.padding in cartItemRenderer.js
            
            const brandingAreaX = padding;
            const brandingAreaY = padding + imageSize + padding;
            const brandingAreaWidth = canvas.width - 2 * padding;
            const brandingAreaHeight = 50;
            
            if (
                x >= brandingAreaX &&
                x <= brandingAreaX + brandingAreaWidth &&
                y >= brandingAreaY &&
                y <= brandingAreaY + brandingAreaHeight
            ) {
                await showBrandingDialog(item);
                return;
            }
        }
        
        // Check if the click is on the "+ Add" button in branding section
        if (item.branding && item.branding.length > 0) {
            const brandingAddBtnX = canvas.width - 16 - 120; // Right-aligned
            const brandingAddBtnY = 86; // Positioned below image and above branding items
            const brandingAddBtnWidth = 120;
            const brandingAddBtnHeight = 24;
            
            if (
                x >= brandingAddBtnX &&
                x <= brandingAddBtnX + brandingAddBtnWidth &&
                y >= brandingAddBtnY &&
                y <= brandingAddBtnY + brandingAddBtnHeight
            ) {
                await showBrandingDialog(item);
                return;
            }
        }
    }
}

/**
 * Show dialog to add branding
 * @param {Object} item - Cart item
 */
async function showBrandingDialog(item) {
    // Fetch print opportunities for this item
    const opportunities = await fetchPrintOpportunities(item.goodsId);
    
    if (!opportunities || opportunities.length === 0) {
        alert('Для данного товара нет доступных опций брендирования.');
        return;
    }
    
    // Create modal dialog
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.margin = '10% auto';
    modalContent.style.padding = '20px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.position = 'relative';
    
    // Create modal title
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Добавить брендирование';
    modalTitle.style.marginTop = '0';
    modalTitle.style.color = '#1e3a8a';
    
    // Create modal close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '10px';
    closeButton.style.top = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#1e3a8a';
    
    // Create form
    const form = document.createElement('form');
    form.id = 'branding-add-form';
    
    // Create type select
    const typeGroup = document.createElement('div');
    typeGroup.style.marginBottom = '15px';
    
    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Тип нанесения:';
    typeLabel.style.display = 'block';
    typeLabel.style.marginBottom = '5px';
    typeLabel.style.fontWeight = 'bold';
    
    const typeSelect = document.createElement('select');
    typeSelect.id = 'branding-type';
    typeSelect.style.width = '100%';
    typeSelect.style.padding = '8px';
    typeSelect.style.border = '1px solid #ccc';
    typeSelect.style.borderRadius = '4px';
    
    // Add options for types
    const types = getUniqueTypes(opportunities);
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        typeSelect.appendChild(option);
    });
    
    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(typeSelect);
    
    // Create location select
    const locationGroup = document.createElement('div');
    locationGroup.style.marginBottom = '15px';
    
    const locationLabel = document.createElement('label');
    locationLabel.textContent = 'Место нанесения:';
    locationLabel.style.display = 'block';
    locationLabel.style.marginBottom = '5px';
    locationLabel.style.fontWeight = 'bold';
    
    const locationSelect = document.createElement('select');
    locationSelect.id = 'branding-location';
    locationSelect.style.width = '100%';
    locationSelect.style.padding = '8px';
    locationSelect.style.border = '1px solid #ccc';
    locationSelect.style.borderRadius = '4px';
    
    // Add initial options for locations
    updateLocationOptions(locationSelect, opportunities, typeSelect.value, item.branding || []);
    
    locationGroup.appendChild(locationLabel);
    locationGroup.appendChild(locationSelect);
    
    // Create colors select
    const colorsGroup = document.createElement('div');
    colorsGroup.style.marginBottom = '15px';
    
    const colorsLabel = document.createElement('label');
    colorsLabel.textContent = 'Количество цветов:';
    colorsLabel.style.display = 'block';
    colorsLabel.style.marginBottom = '5px';
    colorsLabel.style.fontWeight = 'bold';
    
    const colorsSelect = document.createElement('select');
    colorsSelect.id = 'branding-colors';
    colorsSelect.style.width = '100%';
    colorsSelect.style.padding = '8px';
    colorsSelect.style.border = '1px solid #ccc';
    colorsSelect.style.borderRadius = '4px';
    
    // Add initial options for colors
    updateColorOptions(colorsSelect, opportunities, typeSelect.value, locationSelect.value);
    
    colorsGroup.appendChild(colorsLabel);
    colorsGroup.appendChild(colorsSelect);
    
    // Create second pass checkbox
    const secondPassGroup = document.createElement('div');
    secondPassGroup.style.marginBottom = '20px';
    
    const secondPassCheckbox = document.createElement('input');
    secondPassCheckbox.type = 'checkbox';
    secondPassCheckbox.id = 'branding-second-pass';
    secondPassCheckbox.style.marginRight = '5px';
    
    const secondPassLabel = document.createElement('label');
    secondPassLabel.htmlFor = 'branding-second-pass';
    secondPassLabel.textContent = 'Второй проход';
    
    secondPassGroup.appendChild(secondPassCheckbox);
    secondPassGroup.appendChild(secondPassLabel);
    
    // Create buttons
    const buttonsGroup = document.createElement('div');
    buttonsGroup.style.display = 'flex';
    buttonsGroup.style.justifyContent = 'flex-end';
    buttonsGroup.style.gap = '10px';
    buttonsGroup.style.marginTop = '20px';
    
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Отмена';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.border = '1px solid #ccc';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.backgroundColor = '#f8f9fa';
    cancelButton.style.cursor = 'pointer';
    
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = 'Добавить';
    addButton.style.padding = '8px 16px';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.backgroundColor = '#1e3a8a';
    addButton.style.color = 'white';
    addButton.style.cursor = 'pointer';
    
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
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Update location options when type changes
    typeSelect.addEventListener('change', () => {
        updateLocationOptions(locationSelect, opportunities, typeSelect.value, item.branding || []);
        updateColorOptions(colorsSelect, opportunities, typeSelect.value, locationSelect.value);
    });
    
    // Update colors options when location changes
    locationSelect.addEventListener('change', () => {
        updateColorOptions(colorsSelect, opportunities, typeSelect.value, locationSelect.value);
    });
    
    // Add branding when form is submitted
    addButton.addEventListener('click', () => {
        const typeId = typeSelect.value;
        const locationId = locationSelect.value;
        const colors = parseInt(colorsSelect.value);
        const secondPass = secondPassCheckbox.checked;
        
        // Get price for this branding option
        const price = getBrandingPrice(
            opportunities, 
            typeId, 
            locationId, 
            colors, 
            item.quantity
        );
        
        // Create new branding item
        const newBranding = {
            type_id: typeId,
            type: typeSelect.options[typeSelect.selectedIndex].text,
            location_id: locationId,
            location: locationSelect.options[locationSelect.selectedIndex].text,
            colors: colors,
            secondPass: secondPass,
            price: price
        };
        
        // Add to existing branding array or create new one
        const branding = item.branding || [];
        branding.push(newBranding);
        
        // Update storage
        updateCartItemBranding(item.id, branding);
        
        // Close modal
        document.body.removeChild(modal);
    });
}

/**
 * Update location options based on selected type and existing branding
 * @param {HTMLSelectElement} locationSelect - Location select element
 * @param {Array} opportunities - Print opportunities
 * @param {string|number} typeId - Selected type ID
 * @param {Array} existingBranding - Existing branding items
 */
function updateLocationOptions(locationSelect, opportunities, typeId, existingBranding) {
    // Clear current options
    locationSelect.innerHTML = '';
    
    // Get locations for this type
    const locations = getLocationsForType(opportunities, typeId);
    
    // Add options
    locations.forEach(location => {
        // Check if this location is still available
        if (isLocationAvailable(opportunities, existingBranding, typeId, location.id)) {
            const option = document.createElement('option');
            option.value = location.id;
            option.textContent = location.name;
            locationSelect.appendChild(option);
        }
    });
    
    // If no options, add placeholder
    if (locationSelect.options.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.selected = true;
        option.textContent = 'Нет доступных мест нанесения';
        locationSelect.appendChild(option);
    }
}

/**
 * Update color options based on selected type and location
 * @param {HTMLSelectElement} colorsSelect - Colors select element
 * @param {Array} opportunities - Print opportunities
 * @param {string|number} typeId - Selected type ID
 * @param {string|number} locationId - Selected location ID
 */
function updateColorOptions(colorsSelect, opportunities, typeId, locationId) {
    // Clear current options
    colorsSelect.innerHTML = '';
    
    // Get color options for this type and location
    const colorOptions = getColorsForTypeAndLocation(opportunities, typeId, locationId);
    
    // Add options
    colorOptions.forEach(colorCount => {
        const option = document.createElement('option');
        option.value = colorCount;
        
        const colorText = colorCount == 1 
            ? '1 цвет' 
            : (colorCount > 1 && colorCount < 5 
                ? `${colorCount} цвета` 
                : `${colorCount} цветов`);
                
        option.textContent = colorText;
        colorsSelect.appendChild(option);
    });
    
    // If no options, add placeholder
    if (colorsSelect.options.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.selected = true;
        option.textContent = 'Нет доступных опций';
        colorsSelect.appendChild(option);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initBrandingAdd);
