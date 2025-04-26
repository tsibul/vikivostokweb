/**
 * Dropdown Handler Module
 * Handles dropdown functionality for branding options
 */

import { updateLocationOptions, updateColorOptions } from './brandingAdd.js';

/**
 * Initializes branding dropdowns with event delegation
 * @param {HTMLElement} form - Form containing all dropdowns
 * @param {Array} opportunities - Branding opportunities array
 */
export function initBrandingDropdowns(form, opportunities) {
    const typeDropdown = form.querySelector('.viki-dropdown:has(input[name="branding-type"])');
    const locationDropdown = form.querySelector('.viki-dropdown:has(input[name="branding-location"])');
    const colorsDropdown = form.querySelector('.viki-dropdown:has(input[name="branding-colors"])');
    
    // One click handler for the entire form using event delegation
    form.addEventListener('click', (e) => {
        // Handle click on trigger element
        const triggerElement = e.target.closest('.viki-dropdown__trigger');
        if (triggerElement) {
            e.stopPropagation();
            const currentDropdown = triggerElement.closest('.viki-dropdown');
            
            // Close other open dropdowns
            form.querySelectorAll('.viki-dropdown--open').forEach(d => {
                if (d !== currentDropdown) {
                    d.classList.remove('viki-dropdown--open');
                }
            });
            
            // Toggle current dropdown
            currentDropdown.classList.toggle('viki-dropdown--open');
            return;
        }
        
        // Handle click on list item
        const listItem = e.target.closest('.branding-modal__li');
        if (listItem) {
            const currentDropdown = listItem.closest('.viki-dropdown');
            const value = listItem.getAttribute('value');
            const text = listItem.textContent.trim();
            
            // Update text and value
            currentDropdown.querySelector('.viki-dropdown__trigger-text').textContent = text;
            currentDropdown.querySelector('input[type="hidden"]').value = value;
            
            // Close dropdown
            currentDropdown.classList.remove('viki-dropdown--open');
            
            // Get dropdown type and handle selection
            const dropdownName = currentDropdown.querySelector('input[type="hidden"]').name;
            handleDropdownSelection(dropdownName, value, opportunities, 
                typeDropdown, locationDropdown, colorsDropdown);
        }
    });
    
    // Close all dropdowns when clicking outside the form
    document.addEventListener('click', () => {
        form.querySelectorAll('.viki-dropdown--open').forEach(d => {
            d.classList.remove('viki-dropdown--open');
        });
    });
}

/**
 * Handles selection in dropdowns and updates dependent dropdowns accordingly
 * @param {string} dropdownName - Name of the dropdown where selection occurred
 * @param {string} value - Selected value
 * @param {Array} opportunities - Branding opportunities array
 * @param {HTMLElement} typeDropdown - Type dropdown element
 * @param {HTMLElement} locationDropdown - Location dropdown element
 * @param {HTMLElement} colorsDropdown - Colors dropdown element
 */
function handleDropdownSelection(dropdownName, value, opportunities,
                               typeDropdown, locationDropdown, colorsDropdown) {
    if (dropdownName === 'branding-type') {
        // Update location list
        const locationList = updateLocationOptions(opportunities, value, []);
        locationDropdown.querySelector('.viki-dropdown__menu-list').innerHTML = locationList;
        
        // Reset dependent dropdowns
        locationDropdown.querySelector('.viki-dropdown__trigger-text').textContent = 'Выберите место';
        locationDropdown.querySelector('input').value = '';
        
        colorsDropdown.querySelector('.viki-dropdown__trigger-text').textContent = 'Выберите количество';
        colorsDropdown.querySelector('input').value = '';
    }
    
    if (dropdownName === 'branding-location' || dropdownName === 'branding-type') {
        // Update colors list
        const typeId = typeDropdown.querySelector('input').value;
        const locationId = locationDropdown.querySelector('input').value;
        
        if (typeId && locationId) {
            const colorList = updateColorOptions(opportunities, typeId, locationId);
            colorsDropdown.querySelector('.viki-dropdown__menu-list').innerHTML = colorList;
            
            if (dropdownName === 'branding-location') {
                // Only reset colors dropdown when location changes
                colorsDropdown.querySelector('.viki-dropdown__trigger-text').textContent = 'Выберите количество';
                colorsDropdown.querySelector('input').value = '';
            }
        }
    }
} 