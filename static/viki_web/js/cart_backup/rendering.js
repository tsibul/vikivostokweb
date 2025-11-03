/**
 * Module for cart rendering functions
 */

import { getBrandingPrice } from './branding.js';

/**
 * Adds CSS styles for promotion badge if not already added
 */
function ensurePromotionBadgeStyles() {
    if (!document.getElementById('promotion-badge-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'promotion-badge-styles';
        styleElement.textContent = `
            .promotion-badge {
                display: inline-block;
                padding: 4px 8px;
                background-color: #ff6b6b;
                color: white;
                font-weight: bold;
                border-radius: 4px;
                font-size: 12px;
                margin-right: 5px;
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * Renders the cart and calculates totals
 */
export function renderCart() {
    // Ensure promotion badge styles are added
    ensurePromotionBadgeStyles();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.querySelector('.cart-page__items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartSummary = document.querySelector('.cart-summary');

    // Show/hide empty cart message
    if (cart.length === 0) {
        cartItemsContainer.classList.add('item-hidden');
        cartSummary.classList.add('item-hidden');
        cartEmpty.classList.remove('item-hidden');
    } else {
        cartItemsContainer.classList.remove('item-hidden');
        cartSummary.classList.remove('item-hidden');
        cartEmpty.classList.add('item-hidden');
    }

    // Update cart items
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let subtotal = 0;
    let brandingTotal = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;

        // Calculate item total
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Calculate branding total
        let itemBrandingTotal = 0;
        if (item.branding && item.branding.length > 0) {
            itemBrandingTotal = item.branding.reduce((sum, b) => sum + (b.price * item.quantity), 0);
            brandingTotal += itemBrandingTotal;
        }

        // Create cart item HTML
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item__image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item__info">
                ${item.promotion ? '<div class="promotion-badge">Акция</div>' : ''}
                <h3 class="cart-item__name">${item.name}</h3>
                <p class="cart-item__article">Артикул: ${item.article}</p>
                <p class="cart-item__description">${item.description || ''}</p>
            </div>
            <div class="cart-item__price">
                <div class="price-container">
                    <input type="number" class="cart-item__price-single-input text-like" value="${item.price.toFixed(2)}" readonly>
                    <span class="currency">руб.</span>
                </div>
            </div>
            <div class="cart-item__quantity">
                <button class="cart-item__quantity-btn cart-item__quantity-decrease">-</button>
                <input type="number" class="cart-item__quantity-input" value="${item.quantity}" min="1">
                <button class="cart-item__quantity-btn cart-item__quantity-increase">+</button>
            </div>
            <div class="cart-item__total">
                <div class="price-container">
                    <span class="cart-item__total-price-input text-like" data-value="${itemTotal.toFixed(2)}">${itemTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span class="currency">руб.</span>
                </div>
            </div>
            <div class="cart-item__actions">
                <button class="cart-item__remove" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            
            <!-- Branding section -->
            <div class="cart-item__branding">
                <div class="branding-header">
                    <h4>Брендирование</h4>
                    <button class="branding-add-btn" data-item="${item.article}" data-goods-id="${item.goodsId}">+ Добавить</button>
                </div>
                
                <div class="branding-items">
                    ${item.branding ? item.branding.map((branding, bIndex) => `
                        <div class="branding-item">
                            <div class="branding-item__row">
                                <div class="branding-field branding-field-type viki-dropdown">
                                    <div class="viki-dropdown__trigger" data-id="${branding.type_id || branding.type}">
                                        ${branding.type}
                                        <span class="viki-dropdown__trigger-icon">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </span>
                                    </div>
                                    <ul class="viki-dropdown__menu viki-dropdown__menu-list branding-type">
                                        <li value="${branding.type_id || branding.type}" selected>
                                            ${branding.type}
                                        </li>
                                    </ul>
                                </div>
                                <div class="branding-field branding-field-location viki-dropdown">
                                    <div class="viki-dropdown__trigger" data-id="${branding.location_id || branding.location}">
                                        ${branding.location}
                                        <span class="viki-dropdown__trigger-icon">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </span>
                                    </div>
                                    <ul class="viki-dropdown__menu viki-dropdown__menu-list branding-location">
                                        <li value="${branding.location_id || branding.location}" selected>
                                            ${branding.location}
                                        </li>                                         
                                    </ul>
                                </div>
                                <div class="branding-field branding-field-colors viki-dropdown">
                                    <div class="viki-dropdown__trigger" data-id="${branding.colors}">
                                                ${(branding.colors == 1 ? '1 цвет' : (branding.colors > 1 && branding.colors < 5
            ? branding.colors + ' цвета' : branding.colors + ' цветов'))}
                                        <span class="viki-dropdown__trigger-icon">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </span>
                                    </div>
                                    <ul class="viki-dropdown__menu viki-dropdown__menu-list branding-colors">
                                        <li value="${branding.colors}" selected>
                                            ${(branding.colors == 1 ? '1 цвет' : (branding.colors > 1 && branding.colors < 5
                                            ? branding.colors + ' цвета' : branding.colors + ' цветов'))}
                                        </li>                                         
                                    </ul>
                                </div>
                                <div class="branding-field branding-checkbox">
                                    <input type="checkbox" id="second-pass-${index}-${bIndex}" class="branding-second-pass" ${branding.secondPass ? 'checked' : ''}>
                                    <label for="second-pass-${index}-${bIndex}">2й проход</label>
                                </div>
                                <div class="branding-field branding-field-price">
                                    <input type="number" class="branding-price text-like" value="${branding.price}" min="0" readonly>
                                    <span class="currency">руб.</span>
                                </div>
                                <div class="branding-field branding-field-total">
                                    <div class="price-container">
                                        <span class="branding-total-price-input text-like" data-value="${(branding.price * item.quantity).toFixed(2)}">${(branding.price * item.quantity).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                        <span class="currency">руб.</span>
                                    </div>
                                </div>
                                <div class="branding-field branding-field-actions">
                                    <button class="branding-remove-btn"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
                <div class="branding-subtotal">
                    <span>Итого за нанесение:</span>
                    <div class="price-container">
                        <span class="branding-subtotal-price-input text-like" data-value="${itemBrandingTotal.toFixed(2)}">${itemBrandingTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        <span class="currency">руб.</span>
                    </div>
                </div>
            </div>
            <div class="cart-item__final-total">
                <span>Итого за товар с нанесением:</span>
                <div class="price-container">
                    <span class="cart-item__final-total-price-input text-like" data-value="${(itemTotal + itemBrandingTotal).toFixed(2)}">${(itemTotal + itemBrandingTotal).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span class="currency">руб.</span>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update cart summary
    const total = subtotal + brandingTotal;
    document.querySelector('.cart-summary__items-input').textContent = totalItems;
    document.querySelector('.cart-summary__items-input').dataset.value = totalItems;

    document.querySelector('.cart-summary__subtotal-input').textContent = subtotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.querySelector('.cart-summary__subtotal-input').dataset.value = subtotal.toFixed(2);

    document.querySelector('.cart-summary__branding-total-input').textContent = brandingTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.querySelector('.cart-summary__branding-total-input').dataset.value = brandingTotal.toFixed(2);

    document.querySelector('.cart-summary__total-input').textContent = total.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.querySelector('.cart-summary__total-input').dataset.value = total.toFixed(2);
}

/**
 * Shows empty cart message
 */
export function showEmptyCart() {
    document.querySelector('.cart-page__items').classList.add('item-hidden');
    document.querySelector('.cart-summary').classList.add('item-hidden');
    document.querySelector('.cart-empty').classList.remove('item-hidden');
} 