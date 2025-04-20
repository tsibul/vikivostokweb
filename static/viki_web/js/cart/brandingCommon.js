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
        const typeSelect = item.querySelector('.branding-type');
        const locationSelect = item.querySelector('.branding-location');
        
        if (typeSelect && typeSelect.value && locationSelect && locationSelect.value) {
            const key = typeSelect.value + '-' + locationSelect.value;
            const currentCount = countByTypeAndPlace.get(key) || 0;
            countByTypeAndPlace.set(key, currentCount + 1);
        }
    });
    
    return countByTypeAndPlace;
} 