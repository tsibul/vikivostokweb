/**
 * Cart Badge Module
 * Handles displaying and updating cart badge count
 */

/**
 * Update cart badge with item count
 * Uses unique items count or total quantity based on configuration
 * @param {Object} options - Configuration options
 * @param {boolean} [options.useUniqueCount=true] - Use unique items count instead of total quantity
 */
export function updateCartBadge(options = { useUniqueCount: true }) {
    try {
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Get all cart badges in the document
        const cartBadges = document.querySelectorAll('.cart-badge');
        
        if (!cartBadges.length) {
            return; // No badges found
        }
        
        // Calculate count based on option
        let count = 0;
        
        if (options.useUniqueCount) {
            // Count unique items
            count = cart.length;
        } else {
            // Count total quantity across all items
            count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
        }
        
        // Update all badge elements
        cartBadges.forEach(badge => {
            badge.textContent = count.toString();
            badge.style.display = count > 0 ? 'block' : 'none';
        });
        
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

/**
 * Initialize cart badge
 * Updates the badge on page load and sets up event listeners
 */
export function initCartBadge() {
    // Update badge on page load
    updateCartBadge();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', event => {
        if (event.key === 'cart') {
            updateCartBadge();
        }
    });
    
    // Listen for custom cart update events
    document.addEventListener('cart:updated', () => {
        updateCartBadge();
    });
}

// Initialize the badge when DOM is ready
document.addEventListener('DOMContentLoaded', initCartBadge);