/**
 * Module for cart price calculations
 */

import { formatPrice } from './utils.js';
import { getBrandingPrice } from './branding.js';
import { printOpportunitiesCache } from './brandingCommon.js';

/**
 * Updates the total price for a cart item and all calculations
 * @param {HTMLElement} cartItem - Cart item element
 */
export function updateItemTotal(cartItem) {
    // Get item quantity
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    
    // Get item price
    let price = 0;
    const priceInput = cartItem.querySelector('.cart-item__price-single-input');
    
    if (priceInput) {
        price = parseFloat(priceInput.value);
    } else {
        // For backward compatibility
        const priceText = cartItem.querySelector('.cart-item__price-single')?.textContent;
        if (priceText) {
            price = parseFloat(priceText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Calculate items cost without branding
    const itemTotal = price * quantity;
    
    // Update item total display
    const totalPriceInput = cartItem.querySelector('.cart-item__total-price-input');
    if (totalPriceInput) {
        totalPriceInput.dataset.value = itemTotal.toFixed(2);
        totalPriceInput.textContent = itemTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else {
        // For backward compatibility
        const totalPriceElement = cartItem.querySelector('.cart-item__total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = formatPrice(itemTotal.toFixed(0)) + ' руб.';
        }
    }
    
    // Update branding prices
    updateBrandingPrices(cartItem);
    
    // Update final item total with branding
    updateItemFinalTotal(cartItem, itemTotal);
}

/**
 * Updates branding prices for a cart item
 * @param {HTMLElement} cartItem - Cart item element
 */
export function updateBrandingPrices(cartItem) {
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    const brandingItems = cartItem.querySelectorAll('.branding-item');
    let brandingTotal = 0;
    
    // Get goodsId for this cart item if possible
    const addBrandingBtn = cartItem.querySelector('.branding-add-btn');
    const goodsId = addBrandingBtn ? addBrandingBtn.dataset.goodsId : null;
    const opportunities = goodsId ? printOpportunitiesCache.get(goodsId) || [] : [];
    
    let priceWasUpdated = false;
    
    brandingItems.forEach(item => {
        // Получаем выбранный тип и место нанесения
        const typeField = item.querySelector('.branding-field-type');
        const typeTrigger = typeField?.querySelector('.viki-dropdown__trigger');
        const typeId = typeTrigger?.dataset.id;
        
        const locationField = item.querySelector('.branding-field-location');
        const locationTrigger = locationField?.querySelector('.viki-dropdown__trigger');
        const locationId = locationTrigger?.dataset.id;
        
        // Get branding price
        const priceInput = item.querySelector('.branding-price');
        let pricePerItem = parseFloat(priceInput.value);
        
        // Если есть возможности нанесения и мы знаем тип и место,
        // обновляем базовую цену в зависимости от количества товара
        if (opportunities.length > 0 && typeId && locationId) {
            const opportunity = opportunities.find(op => 
                op.print_type_id == typeId && op.print_place_id == locationId
            );
            
            if (opportunity) {
                // Обновляем базовую цену исходя из количества
                const newBasePrice = getBrandingPrice(opportunity, quantity);
                
                // Если цена изменилась, обновляем значение в поле
                if (Math.abs(pricePerItem - newBasePrice) > 0.01) { // Учитываем погрешность чисел с плавающей точкой
                    priceInput.value = newBasePrice;
                    pricePerItem = newBasePrice;
                    priceWasUpdated = true;
                }
            }
        }
        
        // Calculate branding cost for all items
        const secondPass = item.querySelector('.branding-second-pass').checked;
        
        // Get colors from dropdown structure - first try the data-id on trigger, then fallback to li value
        let colors = 1; // Default to 1 color
        const colorsDropdown = item.querySelector('.branding-colors');
        const colorsTrigger = colorsDropdown?.closest('.viki-dropdown')?.querySelector('.viki-dropdown__trigger');
        
        if (colorsTrigger && colorsTrigger.dataset.id) {
            colors = parseInt(colorsTrigger.dataset.id);
        } else {
            // Fallback to old structure
            const colorsLi = colorsDropdown?.querySelector('li');
            if (colorsLi) {
                colors = parseInt(colorsLi.getAttribute('value'));
            }
        }
        
        // Multiplier based on number of colors
        let colorMultiplier = 1;
        if (!isNaN(colors)) {
            // Increase price by 20% for each additional color
            colorMultiplier = 1 + (colors - 1) * 0.2;
        }
        
        // If second pass is selected, increase price by 30%
        const secondPassMultiplier = secondPass ? 1.3 : 1;
        
        // Final branding price
        const totalPrice = pricePerItem * quantity * colorMultiplier * secondPassMultiplier;
        brandingTotal += totalPrice;
        
        // Update branding price display
        const brandingTotalPriceInput = item.querySelector('.branding-total-price-input');
        if (brandingTotalPriceInput) {
            brandingTotalPriceInput.dataset.value = totalPrice.toFixed(2);
            brandingTotalPriceInput.textContent = totalPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } else {
            // For backward compatibility
            const brandingTotalPrice = item.querySelector('.branding-total-price');
            if (brandingTotalPrice) {
                brandingTotalPrice.textContent = formatPrice(totalPrice.toFixed(0)) + ' руб.';
            }
        }
    });
    
    // Update total branding cost
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    if (brandingSubtotalInput) {
        brandingSubtotalInput.dataset.value = brandingTotal.toFixed(2);
        brandingSubtotalInput.textContent = brandingTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else {
        // For backward compatibility
        const brandingSubtotal = cartItem.querySelector('.branding-subtotal-price');
        if (brandingSubtotal) {
            brandingSubtotal.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
        }
    }
    
    // Если цена была обновлена, обновляем данные в localStorage
    if (priceWasUpdated) {
        // Импортируем функцию здесь, чтобы избежать циклической зависимости
        import('./brandingHelpers.js').then(module => {
            module.updateCartBrandingInLocalStorage(cartItem);
        });
    }
    
    return brandingTotal;
}

/**
 * Updates the final total price for a cart item including branding
 * @param {HTMLElement} cartItem - Cart item element
 * @param {number} itemTotal - Item total without branding
 */
export function updateItemFinalTotal(cartItem, itemTotal) {
    // Get branding total
    let brandingTotal = 0;
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    
    if (brandingSubtotalInput) {
        brandingTotal = parseFloat(brandingSubtotalInput.dataset.value);
    } else {
        // For backward compatibility
        const brandingTotalText = cartItem.querySelector('.branding-subtotal-price')?.textContent;
        if (brandingTotalText) {
            brandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Calculate final total
    const finalTotal = itemTotal + brandingTotal;
    
    // Update final total display
    const finalTotalInput = cartItem.querySelector('.cart-item__final-total-price-input');
    if (finalTotalInput) {
        finalTotalInput.dataset.value = finalTotal.toFixed(2);
        finalTotalInput.textContent = finalTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else {
        // For backward compatibility
        const finalTotalElement = cartItem.querySelector('.cart-item__final-total-price');
        if (finalTotalElement) {
            finalTotalElement.textContent = formatPrice(finalTotal.toFixed(0)) + ' руб.';
        }
    }
} 