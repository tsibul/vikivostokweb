/**
 * Price Formatter Module
 * Handles formatting price values for display
 */

/**
 * Format price as string with proper formatting
 * @param {number} price - Price to format
 * @param {string} locale - Locale to use for formatting (default: 'ru-RU')
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
    }
    
    return price.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Parse price string to number
 * @param {string} priceString - Price string to parse
 * @returns {number} Parsed price
 */
export function parsePrice(priceString) {
    if (typeof priceString === 'number') {
        return priceString;
    }
    
    // Clean the string from currency symbols and spaces
    return parseFloat(
        priceString
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
    ) || 0;
}

/**
 * Get discounted price
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discounted price
 */
export function getDiscountedPrice(price, discountPercent) {
    if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
    }
    
    if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
        return price;
    }
    
    const discountAmount = price * (discountPercent / 100);
    return parseFloat((price - discountAmount).toFixed(2));
} 