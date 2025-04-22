/**
 * Add Product Module
 * Handles adding products to cart
 */

import { addCartItem, getCartItem, updateCartItem, getCart } from '../storage/cartStorage.js';
import { showAddToCartNotification, showErrorNotification } from './notification.js';
import { fetchProductPrice, calculateProductPrice } from '../pricing/productPriceCalculator.js';

// Custom event for tracking add to cart actions
export const ADD_TO_CART_EVENT = 'product:added_to_cart';

/**
 * Add product to cart
 * @param {Object} productData - Product data
 * @returns {Promise<Object|null>} - Added product or null if failed
 */
export async function addProductToCart(productData) {
    try {
        // Validate required fields
        if (!productData || !productData.id) {
            showErrorNotification('Невозможно добавить товар в корзину: отсутствует ID товара');
            return null;
        }
        
        // Check if exactly the same product (by item_id) already exists in cart
        const existingProduct = getCartItem(productData.id);
        
        // If the exact same product exists, show notification and return it
        if (existingProduct) {
            showAddToCartNotification(existingProduct, true);
            return existingProduct;
        }
        
        // Use the original price from DOM as fallback
        const originalPrice = productData.price || 0;
        
        // Make sure all required fields are present
        const product = {
            id: productData.id,
            goodsId: productData.goodsId || productData.id,
            name: productData.name || 'Товар',
            article: productData.article || '',
            description: productData.description || '',
            image: productData.image || '/static/viki_web/icons/logo.svg',
            price: originalPrice, // Initialize with original price as fallback
            quantity: 1,          // Always use quantity 1 regardless of what was passed
            branding: [],         // Initialize with empty branding array
            promotion: !!productData.promotion
        };
        
        // Add to cart with original price
        addCartItem(product);
        
        // This is a new product (not previously in the cart), so show "added" notification
        showAddToCartNotification(product, false);
        
        // Dispatch custom event for tracking
        document.dispatchEvent(new CustomEvent(ADD_TO_CART_EVENT, {
            detail: { product }
        }));
        
        // Try to get better price asynchronously
        try {
            // Attempt to fetch price data
            const priceData = await fetchProductPrice(product.id);
            
            if (priceData && priceData.success) {
                // Calculate actual price based on quantity 1
                const calculatedPrice = calculateProductPrice(priceData, 1);
                
                // Only update if the price is different
                if (calculatedPrice !== product.price) {
                    // Update product with calculated price
                    product.price = calculatedPrice;
                    
                    // Update product in cart
                    updateCartItem(product);
                    
                    console.log(`Price updated for ${product.name}: ${originalPrice} -> ${calculatedPrice}`);
                }
            }
        } catch (priceError) {
            // Just log the error, we already have a fallback price
            console.warn('Could not fetch price data, using original price:', priceError);
        }
        
        return product;
    } catch (error) {
        console.error('Error adding product to cart:', error);
        showErrorNotification('Ошибка при добавлении товара в корзину');
        return null;
    }
} 