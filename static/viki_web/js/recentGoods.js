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
    // Extract the required data
    const goodsItem = product.goods_item || {};
    const randomItem = product.random_item || {};
    const randomItemData = randomItem.item || {};
    const price = product.price || 0;
    const priceVolume = product.price_volume || false;
    const promotionPrice = product.promotion_price || randomItem.promotion_price || false;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'recently-viewed__item';
    itemDiv.dataset.id = goodsItem.id
    
    // Get the image path from the random item
    const imagePath = randomItemData.image || '';
    
    // Get article from random_item.item.item_article
    const article = randomItemData.item_article || goodsItem.article || '';
    
    // Create color elements based on available colors
    const colorElements = this.createColorElements(product.colors || []);
    
    // Определяем правильную начальную цену
    const initialPrice = (randomItem.price && randomItem.price !== '0' && randomItem.price !== '') 
                     ? randomItem.price 
                     : price || '0';
    
    let images = '';
    product.item_list.forEach(item => {
      // Определяем правильную цену
      const itemPrice = (item.price && item.price !== '0' && item.price !== '') 
                        ? item.price 
                        : product.price || '0';
      
      const itemPromotionPrice = item.promotion_price || product.promotion_price || false;
                        
      if (item.item.id != product.id_random) {
        images += `<img src="/static/viki_web_cms/files/item_photo/${item.item.image}" 
                      alt="${item.item.name || ''}" 
                      class="item-hidden item-opaque"
                      loading="lazy"
                      data-id="${item.item.id}"
                      data-article="${item.item.item_article || ''}"
                      data-price="${itemPrice}"
                      data-promotion="${itemPromotionPrice ? 'true' : 'false'}"
                      data-color-description="${item.color_description || ''}" />`
      } else {
        images += `<img src="/static/viki_web_cms/files/item_photo/${item.item.image}" 
                      alt="${item.item.name || ''}" 
                      data-id="${item.item.id}"
                      data-article="${item.item.item_article || ''}"
                      data-price="${itemPrice}"
                      data-promotion="${itemPromotionPrice ? 'true' : 'false'}"
                      data-color-description="${item.color_description || ''}" />`
      }
    });
    itemDiv.innerHTML = `
      <div class="recently-viewed__img">
       <button class="recently-viewed__nav-button recently-viewed__nav-button--prev">
          <i class="fa-solid fa-chevron-left"></i>
       </button>
       <button class="recently-viewed__nav-button recently-viewed__nav-button--next">
          <i class="fa-solid fa-chevron-right"></i>
       </button>
       ${images}
      </div>
      <div class="recently-viewed__info">
        <div class="recently-viewed__name">${goodsItem.name || ''}</div>
        <div class="recently-viewed__article" data-name="article">Артикул: ${article}</div>
        <div class="recently-viewed__description" data-name="description">${randomItem.color_description || ''}</div>
        <div class="recently-viewed__price" data-name="price">
            <span>Цена${priceVolume ? ' от' : ''}:</span> ${initialPrice} руб.
            ${promotionPrice ? '<span class="product-promotion-badge">Акция</span>' : ''}
        </div>
        <div class="recently-viewed__colors">
          ${colorElements}
        </div>
      </div>
      <button class="recently-viewed__cart-btn btn btn__save add-to-cart">
        <i class="fa-solid fa-cart-shopping"></i>&nbsp; В корзину
      </button>
      <a class="btn-hor"
         href="/product/${goodsItem.slug}">
         <button class="btn btn__cancel btn-sqr">
            <div>Подробнее&nbsp;</div>
            <i class="fa-solid fa-arrow-right"></i>
        </button>
      </a>
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

    return colors.map(color => {
      const hexCode = color.main_color__hex || '#FFFFFF';
      const colorName = color.main_color__name || 'Цвет';
      const colorId = color.id;

      return `
        <div class="square square-small tooltip" 
             style="background-color: ${hexCode};"  
             data-id="${colorId}">
          <span class="tooltip-text">${colorName}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Navigate recently viewed product images
   * @param {HTMLElement} container - Container element
   * @param {string} direction - Direction to navigate ('prev' or 'next')
   */
  static navigateRecentlyViewedImages(container, direction) {
    const images = Array.from(container.querySelectorAll('.recently-viewed__img img'));
    if (images.length <= 1) return;

    // Find the currently visible image
    const currentImage = images.find(img => !img.classList.contains('item-hidden'));
    if (!currentImage) return;

    const currentIndex = images.indexOf(currentImage);
    let newIndex;

    if (direction === 'prev') {
      // Go to previous image (or last image if current is first)
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      // Go to next image (or first image if current is last)
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }

    const newImage = images[newIndex];
    
    // Hide current image
    currentImage.classList.add('item-hidden');
    
    // Show new image
    newImage.classList.remove('item-hidden', 'item-opaque');
    
    // Update color square selection
    const newItemId = newImage.dataset.id;
    const allSquares = container.querySelectorAll('.recently-viewed__colors .square');
    
    allSquares.forEach(sq => {
      sq.style.outline = 'none';
      sq.style.outlineOffset = '0';
      
      if (sq.dataset.id === newItemId) {
        sq.style.outline = '1px solid #009EA3'; // $colorSecondary
        sq.style.outlineOffset = '2px';
      }
    });
    
    // Update product information
    const articleElem = container.querySelector('.recently-viewed__article');
    if (articleElem) {
      articleElem.textContent = `Артикул: ${newImage.dataset.article}`;
    }
    
    const priceElem = container.querySelector('.recently-viewed__price');
    if (priceElem) {
      const priceText = newImage.dataset.price || '0';
      const volumePrice = container.querySelector('.recently-viewed__price span').textContent.includes('от');
      const isPromotion = newImage.dataset.promotion === 'true';
      
      priceElem.innerHTML = `<span>Цена${volumePrice ? ' от' : ''}:</span> ${priceText} руб.
                            ${isPromotion ? '<span class="product-promotion-badge">Акция</span>' : ''}`;
    }
    
    const descriptionElem = container.querySelector('.recently-viewed__description');
    if (descriptionElem) {
      descriptionElem.textContent = newImage.getAttribute('data-color-description') || '';
    }
  }

  /**
   * Initialize event listeners for the recently viewed section
   */
  static initEventListeners() {
    // Color selection
    const colorSquares = document.querySelectorAll('.recently-viewed__colors .square');

    colorSquares.forEach(square => {
      // First highlight the color square that corresponds to the initial random image
      const itemContainer = square.closest('.recently-viewed__item');
      const images = itemContainer.querySelectorAll('.recently-viewed__img img');
      
      // Get the visible image
      const visibleImg = [...images].find(img => !img.classList.contains('item-hidden'));
      if (visibleImg) {
        // Find squares with matching data-id and add colorSecondary border
        const matchingSquares = itemContainer.querySelectorAll(`.square[data-id="${visibleImg.dataset.id}"]`);
        matchingSquares.forEach(sq => {
          sq.style.outline = '1px solid #009EA3'; // $colorSecondary
          sq.style.outlineOffset = '2px';
        });
      }
      
      // Add click event
      square.addEventListener('click', function() {
        const container = this.closest('.recently-viewed__item');
        const squareId = this.dataset.id;
        const images = container.querySelectorAll('.recently-viewed__img img');
        
        // Remove border from all squares in this container
        const allSquares = container.querySelectorAll('.recently-viewed__colors .square');
        allSquares.forEach(sq => {
          sq.style.outline = 'none';
          sq.style.outlineOffset = '0';
        });
        
        // Add border to clicked square
        this.style.outline = '1px solid #009EA3'; // $colorSecondary
        this.style.outlineOffset = '2px';
        
        // Find the currently visible image
        const currentImage = [...images].find(img => !img.classList.contains('item-hidden'));
        if (!currentImage) return;
        
        // Find the image that corresponds to the clicked color
        const newImage = [...images].find(img => img.dataset.id === squareId);
        if (!newImage || currentImage === newImage) return;
        
        // Simple class swapping for images without animation
        currentImage.classList.add('item-hidden');
        newImage.classList.remove('item-hidden', 'item-opaque');
        
        // Update article, price, and description using image data attributes
        const articleElem = container.querySelector('.recently-viewed__article');
        if (articleElem) {
          articleElem.textContent = `Артикул: ${newImage.dataset.article}`;
        }
        
        const priceElem = container.querySelector('.recently-viewed__price');
        if (priceElem) {
          const priceText = newImage.dataset.price || '0';
          const volumePrice = container.querySelector('.recently-viewed__price span').textContent.includes('от');
          const isPromotion = newImage.dataset.promotion === 'true';
          
          priceElem.innerHTML = `<span>Цена${volumePrice ? ' от' : ''}:</span> ${priceText} руб.
                                ${isPromotion ? '<span class="product-promotion-badge">Акция</span>' : ''}`;
        }
        
        const descriptionElem = container.querySelector('.recently-viewed__description');
        if (descriptionElem) {
          descriptionElem.textContent = newImage.getAttribute('data-color-description') || '';
        }
      });
    });

    // Navigation buttons
    const prevButtons = document.querySelectorAll('.recently-viewed__nav-button--prev');
    const nextButtons = document.querySelectorAll('.recently-viewed__nav-button--next');

    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        const container = this.closest('.recently-viewed__item');
        RecentlyViewed.navigateRecentlyViewedImages(container, 'prev');
      });
    });

    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        const container = this.closest('.recently-viewed__item');
        RecentlyViewed.navigateRecentlyViewedImages(container, 'next');
      });
    });

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.recently-viewed__cart-btn');

    addToCartButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const item = this.closest('.recently-viewed__item');
        const name = item.querySelector('.recently-viewed__name').textContent;
        const article = item.querySelector('.recently-viewed__article').textContent.replace('Артикул: ', '');
        const selectedColor = item.querySelector('.square[style*="outline: 1px solid"]');

        if (selectedColor) {
          const colorName = selectedColor.querySelector('.tooltip-text').textContent;

          // Show confirmation modal
          const product = {name, article, color: colorName};

          CartAlert.showAddToCartModal(product, function (product) {
            // Show success notification
            CartAlert.showSuccessMessage(product);
          });
        }
      });
    });
  }
}

export default RecentlyViewed;
