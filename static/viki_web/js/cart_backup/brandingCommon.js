/**
 * Common data and utilities for branding modules to avoid circular dependencies
 */

// Cache for storing print opportunities of products
export const printOpportunitiesCache = new Map();

/**
 * Gets branding count by type and place
 * @param {HTMLElement} brandingContainer - Container with brandings
 * @return {Map} - Map with counts by type and place
 */
export function getBrandingCountByTypeAndPlace(brandingContainer) {
    const brandingItems = brandingContainer.querySelectorAll('.branding-item');
    const countByTypeAndPlace = new Map();
    
    brandingItems.forEach(item => {
        const typeField = item.querySelector('.branding-field-type');
        const typeTrigger = typeField?.querySelector('.viki-dropdown__trigger');
        const locationDropdown = item.querySelector('.branding-field-location');
        
        if (typeTrigger && typeTrigger.dataset.id && locationDropdown) {
            const locationTrigger = locationDropdown.querySelector('.viki-dropdown__trigger');
            if (locationTrigger && locationTrigger.dataset.id) {
                const key = typeTrigger.dataset.id + '-' + locationTrigger.dataset.id;
                const currentCount = countByTypeAndPlace.get(key) || 0;
                countByTypeAndPlace.set(key, currentCount + 1);
            }
        }
    });
    
    return countByTypeAndPlace;
} 