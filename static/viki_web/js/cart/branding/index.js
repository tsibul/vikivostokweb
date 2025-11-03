/**
 * Branding Module Index
 * Exports all branding functionality
 */

import { 
    fetchPrintOpportunities, 
    printOpportunitiesCache 
} from './brandingOptionsManager.js';

/**
 * Load print opportunities for all items in cart
 * @returns {Promise<void>}
 */
export async function loadPrintOpportunities() {
    try {
        // Get cart items
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // No need to load if cart is empty
        if (cart.length === 0) return;
        
        // Load print opportunities for each item
        const promises = cart.map(item => {
            if (item.goodsId) {
                return fetchPrintOpportunities(item.goodsId);
            }
            return Promise.resolve([]);
        });
        
        // Wait for all to complete
        await Promise.all(promises);
    } catch (error) {
        console.error('Error loading print opportunities:', error);
    }
}

// Export other needed functions
export { 
    fetchPrintOpportunities,
    printOpportunitiesCache
}; 