'use strict';

import CartAlert from './cart_alert.js';

/**
 * Инициализация функций корзины при загрузке документа
 */
document.addEventListener('DOMContentLoaded', function() {
    initCartQuantity();
    initCartItemRemove();
    initBranding();
    initRecentlyViewed();
});

/**
 * Инициализация кнопок изменения количества товаров
 */
function initCartQuantity() {
    const decreaseButtons = document.querySelectorAll('.cart-item__quantity-decrease');
    const increaseButtons = document.querySelectorAll('.cart-item__quantity-increase');
    const quantityInputs = document.querySelectorAll('.cart-item__quantity-input');

    // Обработка кнопок уменьшения количества
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('.cart-item__quantity-input');
            let value = parseInt(input.value);
            if (value > parseInt(input.min)) {
                input.value = value - 1;
                updateItemTotal(this.closest('.cart-item'));
                updateCartSummary();
            }
        });
    });

    // Обработка кнопок увеличения количества
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('.cart-item__quantity-input');
            let value = parseInt(input.value);
            input.value = value + 1;
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
        });
    });

    // Обработка изменения значения в поле ввода
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (parseInt(this.value) < parseInt(this.min)) {
                this.value = this.min;
            }
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
        });
    });
}

/**
 * Инициализация кнопок удаления товаров
 */
function initCartItemRemove() {
    const removeButtons = document.querySelectorAll('.cart-item__remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.remove();
            updateCartSummary();
            
            // Проверка на пустую корзину
            const cartItems = document.querySelectorAll('.cart-item');
            if (cartItems.length === 0) {
                showEmptyCart();
            }
        });
    });
}

/**
 * Обновление итоговой стоимости товара и всех расчетов
 * @param {HTMLElement} cartItem - Элемент товара в корзине
 */
function updateItemTotal(cartItem) {
    // Получаем количество товара
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    
    // Получаем цену товара
    const priceText = cartItem.querySelector('.cart-item__price-single').textContent;
    const price = parseFloat(priceText.replace(/[^\d.]/g, '').replace(',', '.'));
    
    // Рассчитываем стоимость товаров без нанесения
    const itemTotal = price * quantity;
    
    // Обновляем отображение стоимости товаров
    cartItem.querySelector('.cart-item__total-price').textContent = formatPrice(itemTotal.toFixed(0)) + ' руб.';
    
    // Обновляем цены нанесения
    updateBrandingPrices(cartItem);
    
    // Обновляем итоговую стоимость товара с нанесением
    updateItemFinalTotal(cartItem, itemTotal);
}

/**
 * Обновление стоимости нанесения для товара
 * @param {HTMLElement} cartItem - Элемент товара в корзине
 */
function updateBrandingPrices(cartItem) {
    const quantity = parseInt(cartItem.querySelector('.cart-item__quantity-input').value);
    const brandingItems = cartItem.querySelectorAll('.branding-item');
    let brandingTotal = 0;
    
    brandingItems.forEach(item => {
        // Получаем цену нанесения
        const priceInput = item.querySelector('.branding-price');
        const pricePerItem = parseFloat(priceInput.value);
        
        // Рассчитываем стоимость нанесения для всех товаров
        const secondPass = item.querySelector('.branding-second-pass').checked;
        const colors = parseInt(item.querySelector('.branding-colors').value);
        
        // Коэффициент доплаты в зависимости от количества цветов
        let colorMultiplier = 1;
        if (!isNaN(colors)) {
            // Увеличиваем цену на 20% за каждый дополнительный цвет
            colorMultiplier = 1 + (colors - 1) * 0.2;
        }
        
        // Если выбран второй проход, увеличиваем цену на 30%
        const secondPassMultiplier = secondPass ? 1.3 : 1;
        
        // Итоговая цена нанесения
        const totalPrice = pricePerItem * quantity * colorMultiplier * secondPassMultiplier;
        brandingTotal += totalPrice;
        
        // Обновляем отображение стоимости нанесения
        item.querySelector('.branding-total-price').textContent = formatPrice(totalPrice.toFixed(0)) + ' руб.';
    });
    
    // Обновляем итоговую стоимость всех нанесений
    const brandingSubtotal = cartItem.querySelector('.branding-subtotal-price');
    if (brandingSubtotal) {
        brandingSubtotal.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
    }
    
    return brandingTotal;
}

/**
 * Обновление итоговой стоимости товара с нанесением
 * @param {HTMLElement} cartItem - Элемент товара в корзине
 * @param {number} itemTotal - Стоимость товаров без нанесения
 */
function updateItemFinalTotal(cartItem, itemTotal) {
    // Получаем стоимость нанесения
    const brandingTotalText = cartItem.querySelector('.branding-subtotal-price').textContent;
    const brandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
    
    // Рассчитываем итоговую стоимость
    const finalTotal = itemTotal + brandingTotal;
    
    // Обновляем отображение итоговой стоимости
    cartItem.querySelector('.cart-item__final-total-price').textContent = formatPrice(finalTotal.toFixed(0)) + ' руб.';
}

/**
 * Обновление итогов корзины
 */
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    const totalElement = document.querySelector('.cart-summary__total span');
    const subtotalElement = document.querySelector('.cart-summary__subtotal span');
    const brandingTotalElement = document.querySelector('.cart-summary__branding-total span');
    const itemsCountElement = document.querySelector('.cart-summary__items span');
    
    let subtotal = 0;
    let brandingTotal = 0;
    
    cartItems.forEach(item => {
        // Стоимость товаров
        const itemTotalText = item.querySelector('.cart-item__total-price').textContent;
        const itemTotal = parseFloat(itemTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        subtotal += itemTotal;
        
        // Стоимость нанесения
        const brandingTotalText = item.querySelector('.branding-subtotal-price').textContent;
        const itemBrandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        brandingTotal += itemBrandingTotal;
    });
    
    // Общая стоимость
    const total = subtotal + brandingTotal;
    
    // Обновляем отображение итогов
    itemsCountElement.textContent = cartItems.length;
    subtotalElement.textContent = formatPrice(subtotal.toFixed(0)) + ' руб.';
    brandingTotalElement.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
    totalElement.textContent = formatPrice(total.toFixed(0)) + ' руб.';
}

/**
 * Отображение сообщения о пустой корзине
 */
function showEmptyCart() {
    document.querySelector('.cart-page__items').classList.add('item-hidden');
    document.querySelector('.cart-summary').classList.add('item-hidden');
    document.querySelector('.cart-empty').classList.remove('item-hidden');
}

/**
 * Форматирование цены с разделителями
 * @param {string} price - Цена для форматирования
 * @return {string} - Отформатированная цена
 */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Инициализация функций управления брендированием
 */
function initBranding() {
    // Инициализация цен нанесения
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        updateBrandingPrices(item);
        
        // Получаем стоимость товаров
        const itemTotalText = item.querySelector('.cart-item__total-price').textContent;
        const itemTotal = parseFloat(itemTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        
        // Обновляем итоговую стоимость товара с нанесением
        updateItemFinalTotal(item, itemTotal);
    });
    
    // Добавление нового брендирования
    const addBrandingButtons = document.querySelectorAll('.branding-add-btn');
    addBrandingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemArticle = this.dataset.item;
            const brandingContainer = this.closest('.cart-item__branding').querySelector('.branding-items');
            const brandingCount = brandingContainer.querySelectorAll('.branding-item').length;
            
            // Создаем новый элемент брендирования
            const newBrandingItem = createBrandingItem(itemArticle, brandingCount + 1);
            brandingContainer.appendChild(newBrandingItem);
            
            // Инициализируем обработчики для нового элемента
            initBrandingItemHandlers(newBrandingItem);
            
            // Обновляем стоимость
            updateItemTotal(this.closest('.cart-item'));
            updateCartSummary();
        });
    });
    
    // Инициализация обработчиков для существующих элементов брендирования
    const brandingItems = document.querySelectorAll('.branding-item');
    brandingItems.forEach(item => {
        initBrandingItemHandlers(item);
    });
}

/**
 * Инициализация обработчиков событий для элемента брендирования
 * @param {HTMLElement} brandingItem - Элемент брендирования
 */
function initBrandingItemHandlers(brandingItem) {
    const cartItem = brandingItem.closest('.cart-item');
    
    // Удаление брендирования
    const removeButton = brandingItem.querySelector('.branding-remove-btn');
    removeButton.addEventListener('click', function() {
        brandingItem.remove();
        updateItemTotal(cartItem);
        updateCartSummary();
    });
    
    // Обработчики изменения типа, места, количества цветов
    const selects = brandingItem.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            updateItemTotal(cartItem);
            updateCartSummary();
        });
    });
    
    // Обработчик изменения цены нанесения
    const priceInput = brandingItem.querySelector('.branding-price');
    priceInput.addEventListener('change', function() {
        if (parseFloat(this.value) < 0) {
            this.value = 0;
        }
        updateItemTotal(cartItem);
        updateCartSummary();
    });
    
    // Обработчик чекбокса "Второй проход"
    const secondPassCheckbox = brandingItem.querySelector('.branding-second-pass');
    secondPassCheckbox.addEventListener('change', function() {
        updateItemTotal(cartItem);
        updateCartSummary();
    });
}

/**
 * Создание элемента брендирования
 * @param {string} itemArticle - Артикул товара
 * @param {number} index - Номер брендирования
 * @return {HTMLElement} - Новый элемент брендирования
 */
function createBrandingItem(itemArticle, index) {
    // Создаем шаблон брендирования в зависимости от типа товара
    let typeOptions = '';
    let locationOptions = '';
    let defaultPrice = 0;
    
    // Задаем опции в зависимости от типа товара
    if (itemArticle.startsWith('PEN')) {
        typeOptions = `
            <option value="laser">Лазерная гравировка</option>
            <option value="uv">УФ-печать</option>
            <option value="tampo">Тампопечать</option>
        `;
        locationOptions = `
            <option value="barrel">Корпус</option>
            <option value="cap">Колпачок</option>
            <option value="clip">Клип</option>
        `;
        defaultPrice = 500;
    } else if (itemArticle.startsWith('NB')) {
        typeOptions = `
            <option value="offset">Офсетная печать</option>
            <option value="digital">Цифровая печать</option>
            <option value="emboss">Тиснение</option>
        `;
        locationOptions = `
            <option value="cover">Обложка</option>
            <option value="back">Задняя сторона</option>
            <option value="pages">Блок страниц</option>
        `;
        defaultPrice = 800;
    } else if (itemArticle.startsWith('MUG')) {
        typeOptions = `
            <option value="sublimation">Сублимация</option>
            <option value="decal">Деколь</option>
            <option value="uv">УФ-печать</option>
        `;
        locationOptions = `
            <option value="front">Лицевая сторона</option>
            <option value="back">Обратная сторона</option>
            <option value="handle">Ручка</option>
        `;
        defaultPrice = 350;
    } else {
        // Значения по умолчанию
        typeOptions = `
            <option value="print">Печать</option>
            <option value="embroidery">Вышивка</option>
            <option value="engraving">Гравировка</option>
        `;
        locationOptions = `
            <option value="front">Лицевая сторона</option>
            <option value="back">Обратная сторона</option>
        `;
        defaultPrice = 450;
    }
    
    // Создаем элемент
    const div = document.createElement('div');
    div.className = 'branding-item';
    div.innerHTML = `
        <div class="branding-item__row">
            <div class="branding-field branding-field-type">
                <select class="branding-type">
                    ${typeOptions}
                </select>
            </div>
            <div class="branding-field branding-field-location">
                <select class="branding-location">
                    ${locationOptions}
                </select>
            </div>
            <div class="branding-field branding-field-colors">
                <select class="branding-colors">
                    <option value="1">1 цвет</option>
                    <option value="2">2 цвета</option>
                    <option value="3">3 цвета</option>
                    <option value="4">4 цвета</option>
                    ${itemArticle.startsWith('MUG') ? '<option value="full">Полноцвет</option>' : ''}
                </select>
            </div>
            <div class="branding-field branding-checkbox">
                <input type="checkbox" id="second-pass-${itemArticle}-${index}" class="branding-second-pass">
                <label for="second-pass-${itemArticle}-${index}">2й проход</label>
            </div>
            <div class="branding-field branding-field-price">
                <input type="number" class="branding-price" value="${defaultPrice}" min="0">
                <span>руб.</span>
            </div>
            <div class="branding-field branding-field-total">
                <span class="branding-total-price">0 руб.</span>
            </div>
            <div class="branding-field branding-field-actions">
                <button class="branding-remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
    
    return div;
}

// Функционал блока "Вы смотрели"
function initRecentlyViewed() {
  // Обработчики для элементов выбора цвета
  const colorSquares = document.querySelectorAll('.recently-viewed__colors .square');
  
  if (colorSquares.length === 0) return;
  
  // Обработчики для выбора цвета
  colorSquares.forEach(square => {
    square.addEventListener('click', function() {
      // Убираем активный класс у всех квадратов в этой группе цветов
      const parentColors = this.closest('.recently-viewed__colors');
      const siblings = parentColors.querySelectorAll('.square');
      
      siblings.forEach(sibling => {
        sibling.classList.remove('color-active');
      });
      
      // Добавляем активный класс нажатому квадрату
      this.classList.add('color-active');
    });
  });
  
  // Обработчики для кнопок "В корзину"
  const addToCartButtons = document.querySelectorAll('.recently-viewed__cart-btn');
  
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.recently-viewed__item');
      const name = item.querySelector('.recently-viewed__name').textContent;
      const article = item.querySelector('.recently-viewed__article').textContent.replace('Артикул: ', '');
      const selectedColor = item.querySelector('.square.color-active');
      
      if (selectedColor) {
        const colorName = selectedColor.querySelector('.tooltip-text').textContent;
        
        // Показываем модальное окно подтверждения
        const product = { name, article, color: colorName };
        
        CartAlert.showAddToCartModal(product, function(product) {
          // Callback при подтверждении
          console.log(`Товар "${product.name}" (${product.article}, цвет: ${product.color}) добавлен в корзину`);
          
          // Показываем уведомление об успешном добавлении
          CartAlert.showSuccessMessage(product);
        });
      }
    });
  });
}