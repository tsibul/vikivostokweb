/**
 * Event Handler Module
 * Handles add to cart button click events
 */

import { extractProductData } from './productExtractor.js';
import { addProductToCart } from './addProduct.js';
import { showErrorNotification } from './notification.js';

// Flag to track if event handlers are already initialized
let eventHandlersInitialized = false;

/**
 * Initialize event handlers for add to cart buttons
 */
export function initAddToCartEvents() {
    // Prevent double initialization
    if (eventHandlersInitialized) {
        return;
    }
    
    // Add event listener for click events using event delegation
    document.addEventListener('click', async function(event) {
        // Find if click was on add to cart button or its child
        const addToCartButton = event.target.closest('.add-to-cart');
        if (!addToCartButton) return;
        
        // Prevent default action (e.g., form submission)
        event.preventDefault();
        
        try {
            // Extract product data from the DOM
            const productData = extractProductData(addToCartButton);
            
            if (!productData) {
                showErrorNotification('Не удалось получить данные о товаре');
                return;
            }
            
            // Add product to cart
            await addProductToCart(productData);
            
        } catch (error) {
            console.error('Error handling add to cart click:', error);
            showErrorNotification('Ошибка при добавлении товара в корзину');
        }
    });
    
    // Set flag to indicate event handlers are initialized
    eventHandlersInitialized = true;
} 