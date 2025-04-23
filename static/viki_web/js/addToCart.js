/**
 * Cart Module for modern browsers
 * Uses ES modules
 */

import { initAddToCart } from './cart/addToCart/index.js';
import eventBus from './cart/eventBus.js';

/**
 * Add product to cart functionality
 * Extracts product data from DOM and adds it to cart
 */
function addToCart() {
    // Find all add to cart buttons
    const addButtons = document.querySelectorAll('.add-to-cart');
    
    // Add click event handlers
    addButtons.forEach(button => {
        button.addEventListener('click', handleAddToCartClick);
    });
}

/**
 * Handle add to cart button click
 * @param {Event} event - Click event
 */
function handleAddToCartClick(event) {
    event.preventDefault();
    
    // Get product data from button's dataset or parent element
    const button = event.currentTarget;
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = parseFloat(button.dataset.productPrice);
    
    if (!productId) {
        console.error('No product ID found for add to cart button');
        return;
    }
    
    // Create product object
    const product = {
        id: productId,
        name: productName || 'Unknown Product',
        price: isNaN(productPrice) ? 0 : productPrice,
        quantity: 1
    };
    
    // Emit event for cart to handle
    eventBus.publish('cart:add', product);
    
    // Show notification
    showAddedToCartNotification(product);
}

/**
 * Show notification that product was added to cart
 * @param {Object} product - Product data
 */
function showAddedToCartNotification(product) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="cart-notification__content">
            <div class="cart-notification__icon">✓</div>
            <div class="cart-notification__text">
                <div class="cart-notification__title">${product.name}</div>
                <div class="cart-notification__message">добавлен в корзину</div>
            </div>
            <button class="cart-notification__close">×</button>
        </div>
    `;
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.cart-notification__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('cart-notification--hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('cart-notification--visible');
    }, 10);
}

// Initialize add to cart functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the add to cart functionality
    initAddToCart();
    
    // Add immediate initialization for pages without cart module
    if (!window.CartManager) {
        console.log('CartManager not found, initializing add to cart functionality');
        initAddToCart();
    }
});

// Subscribe to cart initialization event as a backup
eventBus.subscribe('cart:initialized', () => {
    initAddToCart();
}); 