/**
 * Module for cart utility functions
 */

/**
 * Formats price with separators
 * @param {string} price - Price to format
 * @return {string} - Formatted price
 */
export function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 