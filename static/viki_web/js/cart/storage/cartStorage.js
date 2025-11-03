/**
 * Cart Storage Module
 * Handles cart data in localStorage
 */

// Custom event for cart updates
const CART_UPDATED_EVENT = 'cart:updated';

/**
 * Get cart from localStorage
 * @returns {Array} Cart items array
 */
export function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (error) {
        console.error('Error getting cart from storage:', error);
        return [];
    }
}

/**
 * Alias for getCart() - returns all cart items
 * @returns {Array} Cart items array
 */
export function getCartItems() {
    return getCart();
}

/**
 * Save cart to localStorage and dispatch update event
 * @param {Array} cart - Cart items array
 */
export function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch custom event for components to listen for cart changes
        document.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { 
            detail: { cart }
        }));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

/**
 * Add item to cart
 * If item with same id exists, it will be replaced
 * @param {Object} item - Cart item to add
 * @param {string} item.id - Unique identifier for the item
 * @returns {Array} Updated cart
 */
export function addCartItem(item) {
    if (!item || !item.id) {
        console.error('Invalid item data, ID is required');
        return getCart();
    }

    const cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
        // Replace existing item
        cart[existingItemIndex] = item;
    } else {
        // Add new item
        cart.push(item);
    }

    saveCart(cart);
    return cart;
}

/**
 * Update an existing item in the cart
 * Only updates if the item with the given ID exists
 * @param {Object} item - Cart item to update
 * @param {string} item.id - Unique identifier for the item
 * @returns {Array} Updated cart or null if item not found
 */
export function updateCartItem(item) {
    if (!item || !item.id) {
        console.error('Invalid item data, ID is required');
        return null;
    }

    const cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex === -1) {
        console.warn('Item not found in cart, cannot update');
        return null;
    }

    // Update item
    cart[existingItemIndex] = item;

    saveCart(cart);
    return cart;
}

/**
 * Remove item from cart by id
 * @param {string} itemId - ID of the item to remove
 * @returns {Array} Updated cart
 */
export function removeCartItem(itemId) {
    if (!itemId) {
        console.error('Item ID is required');
        return getCart();
    }

    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== itemId);

    saveCart(filteredCart);
    return filteredCart;
}

// /**
//  * Update item quantity in cart
//  * @param {string} itemId - ID of the item to update
//  * @param {number} quantity - New quantity
//  * @returns {Array} Updated cart
//  */
// export function updateCartItemQuantity(itemId, quantity) {
//     if (!itemId) {
//         console.error('Item ID is required');
//         return getCart();
//     }
//
//     const cart = getCart();
//     const itemIndex = cart.findIndex(item => item.id === itemId);
//
//     if (itemIndex !== -1) {
//         cart[itemIndex].quantity = parseInt(quantity) || 1;
//         saveCart(cart);
//     }
//
//     return cart;
// }

/**
 * Clear cart
 * @returns {Array} Empty cart
 */
export function clearCart() {
    saveCart([]);
    return [];
}

/**
 * Get cart item by id
 * @param {string} itemId - ID of the item to get
 * @returns {Object|null} Cart item or null if not found
 */
export function getCartItem(itemId) {
    if (!itemId) return null;
    
    const cart = getCart();
    return cart.find(item => item.id === itemId) || null;
} 