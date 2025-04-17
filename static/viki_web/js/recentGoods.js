'use strict';

import CartAlert from './cart_alert.js';

/**
 * Class for handling the Recently Viewed Products functionality
 */
class RecentlyViewed {
  /**
   * Initialize the Recently Viewed section
   */
  static init() {
    const container = document.querySelector('.recently-viewed__items');
    if (!container) return;
    
    // Clear the container
    container.innerHTML = '';
    
    // Load products from localStorage
    const products = this.getRecentlyViewedProducts();
    
    // Render products
    if (products && products.length > 0) {
      products.forEach(product => {
        const productElement = this.createProductElement(JSON.parse(product.data));
        container.appendChild(productElement);
      });
      
      // Initialize event listeners
      this.initEventListeners();
    }
  }
  
  /**
   * Get recently viewed products from localStorage
   * @returns {Array} Array of recently viewed products
   */
  static getRecentlyViewedProducts() {
    try {
      const recentlyViewed = localStorage.getItem('recentlyViewed');
      return recentlyViewed ? JSON.parse(recentlyViewed) : [];
    } catch (error) {
      console.error('Error retrieving recently viewed products:', error);
      return [];
    }
  }
  
  /**
   * Create HTML element for a product
   * @param {Object} product - Product data
   * @returns {HTMLElement} Product element
   */
  static createProductElement(product) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'recently-viewed__item';
    
    // Extract the required data
    const goodsItem = product.goods_item || {};
    const randomItem = product.random_item || {};
    const randomItemData = randomItem.item || {};
    const price = product.price || 0;
    const priceVolume = product.price_volume || false;
    
    // Get the image path from the random item
    const imagePath = randomItemData.image || '';
    
    // Get article from random_item.item.item_article
    const article = randomItemData.item_article || goodsItem.article || '';
    
    // Create color elements based on available colors
    const colorElements = this.createColorElements(product.colors || []);
    
    itemDiv.innerHTML = `
      <div class="recently-viewed__img">
        <img src="/static/viki_web_cms/files/item_photo/${imagePath}" alt="${goodsItem.name || ''}">
      </div>
      <div class="recently-viewed__info">
        <div class="recently-viewed__name">${goodsItem.name || ''}</div>
        <div class="recently-viewed__article">Артикул: ${article}</div>
        <div class="recently-viewed__description">${randomItem.color_description || ''}</div>
        <div class="recently-viewed__price"><span>Цена${priceVolume ? ' от' : ''}:</span> ${price} руб.</div>
        <div class="recently-viewed__colors">
          ${colorElements}
        </div>
      </div>
      <button class="recently-viewed__cart-btn btn btn__save">
        <i class="fa-solid fa-cart-shopping"></i>&nbsp; В корзину
      </button>
    `;
    
    return itemDiv;
  }
  
  /**
   * Create HTML for color selection elements
   * @param {Array} colors - Array of color objects
   * @returns {string} HTML string with color elements
   */
  static createColorElements(colors) {
    if (!colors || colors.length === 0) return '';
    
    return colors.map((color, index) => {
      const hexCode = color.main_color__hex || '#FFFFFF';
      const colorName = color.main_color__name || 'Цвет';
      const isActive = index === 0 ? 'color-active' : '';
      
      return `
        <div class="square ${isActive}" style="background-color: ${hexCode};">
          <span class="tooltip-text">${colorName}</span>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Initialize event listeners for the recently viewed section
   */
  static initEventListeners() {
    // Color selection
    const colorSquares = document.querySelectorAll('.recently-viewed__colors .square');
    
    colorSquares.forEach(square => {
      square.addEventListener('click', function() {
        // Remove active class from siblings
        const parentColors = this.closest('.recently-viewed__colors');
        parentColors.querySelectorAll('.square').forEach(sibling => {
          sibling.classList.remove('color-active');
        });
        
        // Add active class to clicked square
        this.classList.add('color-active');
      });
    });
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.recently-viewed__cart-btn');
    
    addToCartButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const item = this.closest('.recently-viewed__item');
        const name = item.querySelector('.recently-viewed__name').textContent;
        const article = item.querySelector('.recently-viewed__article').textContent.replace('Артикул: ', '');
        const selectedColor = item.querySelector('.square.color-active');
        
        if (selectedColor) {
          const colorName = selectedColor.querySelector('.tooltip-text').textContent;
          
          // Show confirmation modal
          const product = { name, article, color: colorName };
          
          CartAlert.showAddToCartModal(product, function(product) {
            // Callback on confirmation
            console.log(`Product "${product.name}" (${product.article}, color: ${product.color}) added to cart`);
            
            // Show success notification
            CartAlert.showSuccessMessage(product);
          });
        }
      });
    });
  }
}

export default RecentlyViewed;
