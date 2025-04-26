/**
 * Branding Options Manager Module
 * Handles fetching and managing branding options for items
 */

// Cache for print opportunities by goodsId
const printOpportunitiesCache = new Map();

/**
 * Fetch printing opportunities for a product
 * @param {string|number} goodsId - Goods ID
 * @returns {Promise<Array>} - Print opportunities
 */
export async function fetchPrintOpportunities(goodsId) {
    // Check cache first
    if (printOpportunitiesCache.has(goodsId)) {
        return printOpportunitiesCache.get(goodsId);
    }
    
    try {
        const response = await fetch(`/api/print-opportunities/${goodsId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch print opportunities');
        }
        
        const data = await response.json();
        
        if (data.success && data.opportunities) {
            // Store in cache
            printOpportunitiesCache.set(goodsId, data.opportunities);
            return data.opportunities;
        } else {
            console.error('Error fetching print opportunities:', data.error || 'Unknown error');
            printOpportunitiesCache.set(goodsId, []);
            return [];
        }
    } catch (error) {
        console.error('Error fetching print opportunities:', error);
        printOpportunitiesCache.set(goodsId, []);
        return [];
    }
}

/**
 * Get unique print types from opportunities
 * @param {Array} opportunities - Print opportunities array
 * @returns {Array} Array of unique print types
 */
export function getUniqueTypes(opportunities) {
    if (!opportunities || !opportunities.length) {
        return [];
    }
    
    // Get unique print types
    const typeMap = new Map();
    
    opportunities.forEach(opportunity => {
        if (!typeMap.has(opportunity.print_type_id)) {
            typeMap.set(opportunity.print_type_id, {
                id: opportunity.print_type_id,
                name: opportunity.print_type_name
            });
        }
    });
    
    return Array.from(typeMap.values());
}

/**
 * Get available locations for a print type
 * @param {Array} opportunities - Print opportunities array
 * @param {string|number} typeId - Print type ID
 * @returns {Array} Array of available locations
 */
export function getLocationsForType(opportunities, typeId) {
    if (!opportunities || !opportunities.length || !typeId) {
        return [];
    }
    
    // Filter opportunities by type
    const locationMap = new Map();
    
    opportunities
        .filter(opportunity => opportunity.print_type_id == typeId)
        .forEach(opportunity => {
            if (!locationMap.has(opportunity.print_place_id)) {
                locationMap.set(opportunity.print_place_id, {
                    id: opportunity.print_place_id,
                    name: opportunity.print_place_name
                });
            }
        });
    
    return Array.from(locationMap.values());
}

/**
 * Get available color options for a type and location
 * @param {Array} opportunities - Print opportunities array
 * @param {string|number} typeId - Print type ID
 * @param {string|number} locationId - Print location ID
 * @returns {Array} Array of available color counts
 */
export function getColorsForTypeAndLocation(opportunities, typeId, locationId) {
    if (!opportunities || !opportunities.length || !typeId || !locationId) {
        return [];
    }
    
    // Find the opportunity that matches type and location
    const matchingOpportunity = opportunities.find(
        opportunity => opportunity.print_type_id == typeId && 
                      opportunity.print_place_id == locationId
    );
    
    if (!matchingOpportunity) {
        return [];
    }
    
    // Get unique color counts
    const colorCounts = [];
    const maxColors = matchingOpportunity.color_quantity || 0;
    for (let i = 1; i <= maxColors; i++) {
        colorCounts.push(i);
    }
    return colorCounts;
}

/**
 * Get prices for a specific branding option
 * @param {Array} opportunities - Print opportunities array
 * @param {string|number} typeId - Print type ID
 * @param {string|number} locationId - Print location ID
 * @param {number} colorCount - Number of colors
 * @returns {Array} Array of price points by quantity
 */
export function getPricesForBranding(opportunities, typeId, locationId, colorCount) {
    if (!opportunities || !opportunities.length || !typeId || !locationId || !colorCount) {
        return [];
    }
    
    // Find the opportunity that matches all criteria
    const matchingOpportunity = opportunities.find(
        opportunity => opportunity.print_type_id == typeId && 
                      opportunity.print_place_id == locationId &&
                      opportunity.color_quantity == colorCount
    );
    
    if (!matchingOpportunity || !matchingOpportunity.prices) {
        return [];
    }
    
    return matchingOpportunity.prices;
}

/**
 * Get price for a specific branding based on item quantity
 * @param {Array} opportunities - Print opportunities array
 * @param {string|number} typeId - Print type ID
 * @param {string|number} locationId - Print location ID
 * @param {number} colorCount - Number of colors
 * @param {number} itemQuantity - Item quantity
 * @returns {number} Price for the branding
 */
export function getBrandingPrice(opportunities, typeId, locationId, colorCount, itemQuantity) {
    const prices = getPricesForBranding(opportunities, typeId, locationId, colorCount);
    
    if (!prices || !prices.length) {
        return 0;
    }
    
    // Sort prices by quantity
    const sortedPrices = [...prices].sort((a, b) => a.quantity - b.quantity);
    
    // Find the price for the given quantity
    let price = sortedPrices[0].price; // Default to the first price
    
    for (let i = 0; i < sortedPrices.length; i++) {
        if (itemQuantity >= sortedPrices[i].quantity) {
            price = sortedPrices[i].price;
        } else {
            break;
        }
    }
    
    return price;
}

/**
 * Count how many times a type and location are used in existing branding
 * @param {Array} branding - Array of branding items
 * @param {string|number} typeId - Print type ID
 * @param {string|number} locationId - Print location ID
 * @returns {number} Count of usages
 */
export function countTypeAndLocationUsage(branding, typeId, locationId) {
    if (!branding || !branding.length) {
        return 0;
    }
    
    return branding.filter(
        item => item.type_id == typeId && item.location_id == locationId
    ).length;
}

/**
 * Check if a location is available for a type
 * @param {Array} opportunities - Print opportunities array
 * @param {Array} branding - Existing branding items
 * @param {string|number} typeId - Print type ID
 * @param {string|number} locationId - Print location ID
 * @returns {boolean} True if location is available
 */
export function isLocationAvailable(opportunities, branding, typeId, locationId) {
    if (!opportunities || !opportunities.length) {
        return false;
    }
    
    // Find opportunity that matches type and location
    const opportunity = opportunities.find(
        opp => opp.print_type_id == typeId && opp.print_place_id == locationId
    );
    
    if (!opportunity) {
        return false;
    }
    
    // Check if place_quantity limit is reached
    const currentUsage = countTypeAndLocationUsage(branding, typeId, locationId);
    return currentUsage < opportunity.place_quantity;
}

// Export cache map
export { printOpportunitiesCache };
