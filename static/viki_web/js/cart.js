'use strict';

import RecentlyViewed from './recentGoods.js';

// Кэш для хранения возможностей печати товаров
const printOpportunitiesCache = new Map();

/**
 * Инициализация функций корзины при загрузке документа
 */
document.addEventListener('DOMContentLoaded', function() {
    initCartQuantity();
    initCartItemRemove();
    initBranding();
    RecentlyViewed.init();
    window.cart = new Cart();
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
            const itemId = this.dataset.id;
            
            // Удаляем товар из localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const updatedCart = cart.filter(item => item.id != itemId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            
            // Обновляем бэдж корзины
            if (window.CartManager) {
                window.CartManager.updateBadge();
            }
            
            // Удаляем товар из DOM
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
    let price = 0;
    const priceInput = cartItem.querySelector('.cart-item__price-single-input');
    
    if (priceInput) {
        price = parseFloat(priceInput.value);
    } else {
        // Для обратной совместимости
        const priceText = cartItem.querySelector('.cart-item__price-single')?.textContent;
        if (priceText) {
            price = parseFloat(priceText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Рассчитываем стоимость товаров без нанесения
    const itemTotal = price * quantity;
    
    // Обновляем отображение стоимости товаров
    const totalPriceInput = cartItem.querySelector('.cart-item__total-price-input');
    if (totalPriceInput) {
        totalPriceInput.value = itemTotal.toFixed(2);
    } else {
        // Для обратной совместимости
        const totalPriceElement = cartItem.querySelector('.cart-item__total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = formatPrice(itemTotal.toFixed(0)) + ' руб.';
        }
    }
    
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
        const brandingTotalPriceInput = item.querySelector('.branding-total-price-input');
        if (brandingTotalPriceInput) {
            brandingTotalPriceInput.value = totalPrice.toFixed(2);
        } else {
            // Для обратной совместимости
            const brandingTotalPrice = item.querySelector('.branding-total-price');
            if (brandingTotalPrice) {
                brandingTotalPrice.textContent = formatPrice(totalPrice.toFixed(0)) + ' руб.';
            }
        }
    });
    
    // Обновляем итоговую стоимость всех нанесений
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    if (brandingSubtotalInput) {
        brandingSubtotalInput.value = brandingTotal.toFixed(2);
    } else {
        // Для обратной совместимости
        const brandingSubtotal = cartItem.querySelector('.branding-subtotal-price');
        if (brandingSubtotal) {
            brandingSubtotal.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
        }
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
    let brandingTotal = 0;
    const brandingSubtotalInput = cartItem.querySelector('.branding-subtotal-price-input');
    
    if (brandingSubtotalInput) {
        brandingTotal = parseFloat(brandingSubtotalInput.value);
    } else {
        // Для обратной совместимости
        const brandingTotalText = cartItem.querySelector('.branding-subtotal-price')?.textContent;
        if (brandingTotalText) {
            brandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
        }
    }
    
    // Рассчитываем итоговую стоимость
    const finalTotal = itemTotal + brandingTotal;
    
    // Обновляем отображение итоговой стоимости
    const finalTotalInput = cartItem.querySelector('.cart-item__final-total-price-input');
    if (finalTotalInput) {
        finalTotalInput.value = finalTotal.toFixed(2);
    } else {
        // Для обратной совместимости
        const finalTotalElement = cartItem.querySelector('.cart-item__final-total-price');
        if (finalTotalElement) {
            finalTotalElement.textContent = formatPrice(finalTotal.toFixed(0)) + ' руб.';
        }
    }
}

/**
 * Обновление итогов корзины
 */
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    let brandingTotal = 0;
    
    cartItems.forEach(item => {
        // Стоимость товаров
        let itemTotal = 0;
        const itemTotalInput = item.querySelector('.cart-item__total-price-input');
        
        if (itemTotalInput) {
            itemTotal = parseFloat(itemTotalInput.value);
        } else {
            // Для обратной совместимости
            const itemTotalText = item.querySelector('.cart-item__total-price')?.textContent;
            if (itemTotalText) {
                itemTotal = parseFloat(itemTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
            }
        }
        subtotal += itemTotal;
        
        // Стоимость нанесения
        let itemBrandingTotal = 0;
        const brandingSubtotalInput = item.querySelector('.branding-subtotal-price-input');
        
        if (brandingSubtotalInput) {
            itemBrandingTotal = parseFloat(brandingSubtotalInput.value);
        } else {
            // Для обратной совместимости
            const brandingTotalText = item.querySelector('.branding-subtotal-price')?.textContent;
            if (brandingTotalText) {
                itemBrandingTotal = parseFloat(brandingTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
            }
        }
        brandingTotal += itemBrandingTotal;
    });
    
    // Общая стоимость
    const total = subtotal + brandingTotal;
    
    // Обновляем отображение итогов
    const itemsCountInput = document.querySelector('.cart-summary__items-input');
    const subtotalInput = document.querySelector('.cart-summary__subtotal-input');
    const brandingTotalInput = document.querySelector('.cart-summary__branding-total-input');
    const totalInput = document.querySelector('.cart-summary__total-input');
    
    if (itemsCountInput && subtotalInput && brandingTotalInput && totalInput) {
        itemsCountInput.value = cartItems.length;
        subtotalInput.value = subtotal.toFixed(2);
        brandingTotalInput.value = brandingTotal.toFixed(2);
        totalInput.value = total.toFixed(2);
    } else {
        // Для обратной совместимости
        const itemsCountElement = document.querySelector('.cart-summary__items span');
        const subtotalElement = document.querySelector('.cart-summary__subtotal span');
        const brandingTotalElement = document.querySelector('.cart-summary__branding-total span');
        const totalElement = document.querySelector('.cart-summary__total span');
        
        if (itemsCountElement && subtotalElement && brandingTotalElement && totalElement) {
            itemsCountElement.textContent = cartItems.length;
            subtotalElement.textContent = formatPrice(subtotal.toFixed(0)) + ' руб.';
            brandingTotalElement.textContent = formatPrice(brandingTotal.toFixed(0)) + ' руб.';
            totalElement.textContent = formatPrice(total.toFixed(0)) + ' руб.';
        }
    }
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
    // Загрузка данных о возможностях печати для всех товаров в корзине
    const cartItems = document.querySelectorAll('.cart-item');
    const goodsIdsToFetch = new Set();
    
    cartItems.forEach(item => {
        const addBrandingBtn = item.querySelector('.branding-add-btn');
        if (addBrandingBtn && addBrandingBtn.dataset.goodsId) {
            const goodsId = addBrandingBtn.dataset.goodsId;
            goodsIdsToFetch.add(goodsId);
        }
    });
    
    // Загружаем данные о печати для всех товаров в корзине
    Promise.all(
        Array.from(goodsIdsToFetch).map(goodsId => 
            fetchPrintOpportunities(goodsId)
        )
    ).then(() => {
        // Проверяем доступность нанесений и управляем кнопками
        cartItems.forEach(item => {
            const addBrandingBtn = item.querySelector('.branding-add-btn');
            if (addBrandingBtn && addBrandingBtn.dataset.goodsId) {
                const goodsId = addBrandingBtn.dataset.goodsId;
                const opportunities = printOpportunitiesCache.get(goodsId) || [];
                
                // Блокируем кнопку только если нет возможностей печати
                if (!opportunities || opportunities.length === 0) {
                    addBrandingBtn.disabled = true;
                    addBrandingBtn.title = 'Нет данных о возможностях нанесения для этого товара';
                    addBrandingBtn.classList.add('disabled');
                } else {
                    // Проверяем доступность мест для нанесения
                    const brandingContainer = item.querySelector('.branding-items');
                    checkAndUpdateAddBrandingButton(addBrandingBtn, goodsId, brandingContainer);
                }
            }
            
            // Инициализация цен нанесения
            updateBrandingPrices(item);
            
            // Получаем стоимость товаров
            const itemTotalInput = item.querySelector('.cart-item__total-price-input');
            let itemTotal = 0;
            
            if (itemTotalInput) {
                itemTotal = parseFloat(itemTotalInput.value);
            } else {
                // Для обратной совместимости проверяем старый формат
                const itemTotalText = item.querySelector('.cart-item__total-price')?.textContent;
                if (itemTotalText) {
                    itemTotal = parseFloat(itemTotalText.replace(/[^\d.]/g, '').replace(',', '.'));
                }
            }
            
            // Обновляем итоговую стоимость товара с нанесением
            updateItemFinalTotal(item, itemTotal);
        });
        
        // Добавление нового брендирования
        const addBrandingButtons = document.querySelectorAll('.branding-add-btn:not([disabled])');
        addBrandingButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemArticle = this.dataset.item;
                const goodsId = this.dataset.goodsId;
                const brandingContainer = this.closest('.cart-item__branding').querySelector('.branding-items');
                const brandingCount = brandingContainer.querySelectorAll('.branding-item').length;
                
                // Создаем новый элемент брендирования с учетом ограничений
                const newBrandingItem = createBrandingItem(itemArticle, goodsId, brandingCount + 1, brandingContainer);
                
                // Проверяем, есть ли доступные места для нанесения
                const typeSelect = newBrandingItem.querySelector('.branding-type');
                const locationSelect = newBrandingItem.querySelector('.branding-location');
                
                if (!locationSelect || locationSelect.options.length === 0) {
                    // Если нет доступных мест, не добавляем элемент и блокируем кнопку
                    this.disabled = true;
                    this.title = 'Достигнут лимит для всех мест нанесения';
                    this.classList.add('disabled');
                    return;
                }
                
                brandingContainer.appendChild(newBrandingItem);
                
                // Инициализируем обработчики для нового элемента
                initBrandingItemHandlers(newBrandingItem);
                
                // Обновляем стоимость
                updateItemTotal(this.closest('.cart-item'));
                updateCartSummary();
                
                // Проверка на возможность добавления еще одного нанесения
                checkAndUpdateAddBrandingButton(this, goodsId, brandingContainer);
                
                // Обновляем данные в localStorage
                updateCartBrandingInLocalStorage(this.closest('.cart-item'));
            });
        });
        
        // Инициализация обработчиков для существующих элементов брендирования
        const brandingItems = document.querySelectorAll('.branding-item');
        brandingItems.forEach(item => {
            initBrandingItemHandlers(item);
        });
    });
}

/**
 * Проверяет возможность добавления еще одного нанесения и обновляет состояние кнопки
 * @param {HTMLElement} addButton - Кнопка добавления нанесения
 * @param {string} goodsId - ID товара
 * @param {HTMLElement} brandingContainer - Контейнер с брендированиями
 */
function checkAndUpdateAddBrandingButton(addButton, goodsId, brandingContainer) {
    const opportunities = printOpportunitiesCache.get(goodsId) || [];
    
    // Если нет данных о возможностях печати, блокируем кнопку
    if (!opportunities || opportunities.length === 0) {
        addButton.disabled = true;
        addButton.title = 'Нет данных о возможностях нанесения для этого товара';
        addButton.classList.add('disabled');
        return;
    }
    
    // Получаем информацию о текущих нанесениях
    const brandingByTypeAndPlace = getBrandingCountByTypeAndPlace(brandingContainer);
    
    // Проверяем, есть ли хотя бы одна доступная комбинация типа и места нанесения
    let hasAvailablePlace = false;
    
    for (const typeId of new Set(opportunities.map(op => op.print_type_id))) {
        const placesForType = opportunities.filter(op => op.print_type_id == typeId);
        
        for (const place of placesForType) {
            const key = typeId + '-' + place.print_place_id;
            const currentCount = brandingByTypeAndPlace.get(key) || 0;
            
            if (currentCount < place.place_quantity) {
                hasAvailablePlace = true;
                break;
            }
        }
        
        if (hasAvailablePlace) break;
    }
    
    // Обновляем состояние кнопки
    if (!hasAvailablePlace) {
        addButton.disabled = true;
        addButton.title = 'Достигнут лимит для всех мест нанесения';
        addButton.classList.add('disabled');
    } else {
        addButton.disabled = false;
        addButton.title = '';
        addButton.classList.remove('disabled');
    }
}

/**
 * Обновляет данные о брендировании в localStorage
 * @param {HTMLElement} cartItem - Элемент товара в корзине
 */
function updateCartBrandingInLocalStorage(cartItem) {
    const removeButton = cartItem.querySelector('.cart-item__remove');
    if (!removeButton || !removeButton.dataset.id) return;
    
    const itemId = removeButton.dataset.id;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id == itemId);
    
    if (itemIndex === -1) return;
    
    // Собираем данные о нанесениях
    const brandingItems = cartItem.querySelectorAll('.branding-item');
    const brandings = [];
    
    brandingItems.forEach(item => {
        const typeSelect = item.querySelector('.branding-type');
        const locationSelect = item.querySelector('.branding-location');
        const colorsSelect = item.querySelector('.branding-colors');
        const secondPassCheckbox = item.querySelector('.branding-second-pass');
        const priceInput = item.querySelector('.branding-price');
        
        if (typeSelect && locationSelect && colorsSelect && priceInput) {
            brandings.push({
                type: typeSelect.options[typeSelect.selectedIndex]?.textContent || typeSelect.value,
                type_id: typeSelect.value,
                location: locationSelect.options[locationSelect.selectedIndex]?.textContent || locationSelect.value,
                location_id: locationSelect.value,
                colors: colorsSelect.value,
                secondPass: secondPassCheckbox ? secondPassCheckbox.checked : false,
                price: parseFloat(priceInput.value) || 0
            });
        }
    });
    
    // Обновляем данные в localStorage
    cart[itemIndex].branding = brandings;
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Инициализация обработчиков событий для элемента брендирования
 * @param {HTMLElement} brandingItem - Элемент брендирования
 */
function initBrandingItemHandlers(brandingItem) {
    const cartItem = brandingItem.closest('.cart-item');
    const brandingContainer = brandingItem.closest('.branding-items');
    const addBrandingBtn = cartItem.querySelector('.branding-add-btn');
    const goodsId = addBrandingBtn?.dataset.goodsId;
    
    // Удаление брендирования
    const removeButton = brandingItem.querySelector('.branding-remove-btn');
    removeButton.addEventListener('click', function() {
        const typeSelect = brandingItem.querySelector('.branding-type');
        const locationSelect = brandingItem.querySelector('.branding-location');
        
        // Удаляем элемент
        brandingItem.remove();
        
        // Обновляем доступные опции для оставшихся элементов
        if (goodsId) {
            updateAllLocationOptionsInContainer(brandingContainer, goodsId);
            
            // Разблокируем кнопку добавления
            if (addBrandingBtn) {
                checkAndUpdateAddBrandingButton(addBrandingBtn, goodsId, brandingContainer);
            }
        }
        
        updateItemTotal(cartItem);
        updateCartSummary();
        
        // Обновляем данные в localStorage
        updateCartBrandingInLocalStorage(cartItem);
    });
    
    // Обработчик изменения типа нанесения
    const typeSelect = brandingItem.querySelector('.branding-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', function() {
            const locationSelect = brandingItem.querySelector('.branding-location');
            const goodsId = this.dataset.goodsId;
            const selectedTypeId = this.value;
            
            // Обновляем опции мест нанесения
            if (goodsId && locationSelect) {
                const opportunities = printOpportunitiesCache.get(goodsId) || [];
                updateLocationOptions(opportunities, selectedTypeId, locationSelect, brandingContainer);
            }
            
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Обновляем данные в localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }
    
    // Обработчик изменения места нанесения
    const locationSelect = brandingItem.querySelector('.branding-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            const goodsId = this.dataset.goodsId;
            const typeSelect = brandingItem.querySelector('.branding-type');
            const colorsSelect = brandingItem.querySelector('.branding-colors');
            
            if (goodsId && typeSelect && colorsSelect) {
                const opportunities = printOpportunitiesCache.get(goodsId) || [];
                const selectedTypeId = typeSelect.value;
                const selectedPlaceId = this.value;
                
                // Обновляем опции количества цветов
                updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect);
                
                // Обновляем доступные места для всех элементов
                updateAllLocationOptionsInContainer(brandingContainer, goodsId);
            }
            
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Обновляем данные в localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }
    
    // Оставшиеся обработчики с добавлением обновления localStorage
    const colorsSelect = brandingItem.querySelector('.branding-colors');
    if (colorsSelect) {
        colorsSelect.addEventListener('change', function() {
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Обновляем данные в localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }
    
    const priceInput = brandingItem.querySelector('.branding-price');
    if (priceInput) {
        priceInput.addEventListener('change', function() {
            if (parseFloat(this.value) < 0) {
                this.value = 0;
            }
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Обновляем данные в localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }
    
    const secondPassCheckbox = brandingItem.querySelector('.branding-second-pass');
    if (secondPassCheckbox) {
        secondPassCheckbox.addEventListener('change', function() {
            updateItemTotal(cartItem);
            updateCartSummary();
            
            // Обновляем данные в localStorage
            updateCartBrandingInLocalStorage(cartItem);
        });
    }
}

/**
 * Создание элемента брендирования
 * @param {string} itemArticle - Артикул товара
 * @param {string} goodsId - ID товара
 * @param {number} index - Номер брендирования
 * @param {HTMLElement} brandingContainer - Контейнер с брендированиями для проверки ограничений
 * @return {HTMLElement} - Новый элемент брендирования
 */
function createBrandingItem(itemArticle, goodsId, index, brandingContainer) {
    const div = document.createElement('div');
    div.className = 'branding-item';
    
    // Получаем возможности печати
    const opportunities = printOpportunitiesCache.get(goodsId) || [];
    
    // Если нет данных о возможностях печати, возвращаем пустой элемент
    if (!opportunities || opportunities.length === 0) {
        return div;
    }
    
    // Получаем уникальные типы печати
    const printTypes = Array.from(new Set(opportunities.map(op => op.print_type_id)))
        .map(typeId => {
            const op = opportunities.find(o => o.print_type_id === typeId);
            return {
                id: typeId,
                name: op ? op.print_type_name : 'Неизвестный тип'
            };
        });
    
    // Создаем опции для типов печати
    let typeOptions = '';
    printTypes.forEach(type => {
        typeOptions += `<option value="${type.id}">${type.name}</option>`;
    });
    
    // Временно создаем div без внутреннего содержимого для получения информации о брендированиях
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `<select class="branding-type" value="${printTypes.length > 0 ? printTypes[0].id : ''}"></select>`;
    div.appendChild(tempDiv);
    
    // Получаем текущие данные о количестве брендирований
    const brandingByTypeAndPlace = getBrandingCountByTypeAndPlace(brandingContainer);
    
    // Определяем первый доступный тип печати и его места
    let firstAvailableType = '';
    let locationOptions = '';
    let defaultPrice = 450;
    
    // Для места печати первоначально берем опции для первого доступного типа
    if (printTypes.length > 0) {
        // Проверяем каждый тип печати на наличие доступных мест
        for (const type of printTypes) {
            const placesForType = opportunities.filter(op => op.print_type_id == type.id);
            const availablePlaces = placesForType.filter(place => {
                const key = type.id + '-' + place.print_place_id;
                const currentCount = brandingByTypeAndPlace.get(key) || 0;
                return currentCount < place.place_quantity;
            });
            
            if (availablePlaces.length > 0) {
                firstAvailableType = type.id;
                
                // Создаем опции для доступных мест
                availablePlaces.forEach(place => {
                    locationOptions += `<option value="${place.print_place_id}">${place.print_place_name}</option>`;
                });
                
                // Устанавливаем примерную стоимость в зависимости от размера нанесения
                const size = availablePlaces[0].length * availablePlaces[0].height;
                if (size < 2500) {
                    defaultPrice = 350;
                } else if (size < 10000) {
                    defaultPrice = 450;
                } else {
                    defaultPrice = 550;
                }
                
                break;
            }
        }
    }
    
    // Убираем временный div
    div.removeChild(tempDiv);
    
    // Если нет доступных мест, возвращаем пустой элемент
    if (!firstAvailableType || locationOptions === '') {
        return div;
    }
    
    // Создаем опции для количества цветов
    let colorOptions = '';
    let maxColors = 4;
    
    // Находим опции для выбранного типа и первого доступного места
    const selectedPlaceId = locationOptions.match(/value="([^"]+)"/)?.[1];
    if (selectedPlaceId) {
        const selectedOpportunity = opportunities.find(op => 
            op.print_type_id == firstAvailableType && op.print_place_id == selectedPlaceId
        );
        
        if (selectedOpportunity) {
            maxColors = selectedOpportunity.color_quantity;
            
            for (let i = 1; i <= maxColors; i++) {
                const colorText = i === 1 ? '1 цвет' : 
                                (i > 1 && i < 5) ? i + ' цвета' : 
                                i + ' цветов';
                colorOptions += `<option value="${i}">${colorText}</option>`;
            }
            
            // Добавляем опцию "Полноцвет" для определенных типов печати
            if (['sublimation', 'uv', 'digital'].includes(firstAvailableType)) {
                colorOptions += `<option value="full">Полноцвет</option>`;
            }
        }
    }
    
    // Создаем элемент
    div.innerHTML = `
        <div class="branding-item__row">
            <div class="branding-field branding-field-type">
                <select class="branding-type" data-goods-id="${goodsId}">
                    ${typeOptions}
                </select>
            </div>
            <div class="branding-field branding-field-location">
                <select class="branding-location" data-goods-id="${goodsId}">
                    ${locationOptions}
                </select>
            </div>
            <div class="branding-field branding-field-colors">
                <select class="branding-colors">
                    ${colorOptions}
                </select>
            </div>
            <div class="branding-field branding-checkbox">
                <input type="checkbox" id="second-pass-${itemArticle}-${index}" class="branding-second-pass">
                <label for="second-pass-${itemArticle}-${index}">2й проход</label>
            </div>
            <div class="branding-field branding-field-price">
                <input type="number" class="branding-price" value="${defaultPrice}" min="0">
                <span class="currency">руб.</span>
            </div>
            <div class="branding-field branding-field-total">
                <div class="price-container">
                    <input type="number" class="branding-total-price-input text-like" value="0.00" readonly>
                    <span class="currency">руб.</span>
                </div>
            </div>
            <div class="branding-field branding-field-actions">
                <button class="branding-remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // Устанавливаем начальное значение типа печати
    const typeSelectElement = div.querySelector('.branding-type');
    if (typeSelectElement) {
        typeSelectElement.value = firstAvailableType;
    }
    
    return div;
}

/**
 * Получает информацию о количестве брендирований по типам и местам
 * @param {HTMLElement} brandingContainer - Контейнер с брендированиями
 * @return {Map} - Map с ключами "typeId-placeId" и количеством брендирований
 */
function getBrandingCountByTypeAndPlace(brandingContainer) {
    if (!brandingContainer) return new Map();
    
    const brandingItems = brandingContainer.querySelectorAll('.branding-item');
    const brandingByTypeAndPlace = new Map();
    
    brandingItems.forEach(item => {
        const typeSelect = item.querySelector('.branding-type');
        const locationSelect = item.querySelector('.branding-location');
        
        if (typeSelect && locationSelect) {
            const typeId = typeSelect.value;
            const placeId = locationSelect.value;
            const key = typeId + '-' + placeId;
            
            if (!brandingByTypeAndPlace.has(key)) {
                brandingByTypeAndPlace.set(key, 1);
            } else {
                brandingByTypeAndPlace.set(key, brandingByTypeAndPlace.get(key) + 1);
            }
        }
    });
    
    return brandingByTypeAndPlace;
}

/**
 * Обновление опций мест нанесения в зависимости от выбранного типа
 * @param {Array} opportunities - Возможности печати
 * @param {string} selectedTypeId - ID выбранного типа нанесения
 * @param {HTMLElement} locationSelect - Select для мест нанесения
 * @param {HTMLElement} brandingContainer - Контейнер с брендированиями для проверки ограничений
 */
function updateLocationOptions(opportunities, selectedTypeId, locationSelect, brandingContainer) {
    if (!locationSelect) return;
    
    // Фильтруем места нанесения по выбранному типу
    const availablePlaces = opportunities.filter(op => op.print_type_id == selectedTypeId);
    
    // Сохраняем текущее выбранное значение
    const currentValue = locationSelect.value;
    
    // Очищаем текущие опции
    locationSelect.innerHTML = '';
    
    // Получаем текущее количество брендирований по типам и местам
    const brandingByTypeAndPlace = getBrandingCountByTypeAndPlace(brandingContainer);
    
    // Добавляем новые опции, только если не превышен лимит для места
    availablePlaces.forEach(place => {
        const key = selectedTypeId + '-' + place.print_place_id;
        const currentCount = brandingByTypeAndPlace.get(key) || 0;
        
        // Добавляем опцию только если количество нанесений не превышает лимит
        if (currentCount < place.place_quantity) {
            const option = document.createElement('option');
            option.value = place.print_place_id;
            option.textContent = place.print_place_name;
            locationSelect.appendChild(option);
        }
    });
    
    // Восстанавливаем выбранное значение, если оно все еще доступно
    if (locationSelect.querySelector(`option[value="${currentValue}"]`)) {
        locationSelect.value = currentValue;
    }
}

/**
 * Обновление опций количества цветов в зависимости от выбранного типа и места нанесения
 * @param {Array} opportunities - Возможности печати
 * @param {string} selectedTypeId - ID выбранного типа нанесения
 * @param {string} selectedPlaceId - ID выбранного места нанесения
 * @param {HTMLElement} colorsSelect - Select для количества цветов
 */
function updateColorsOptions(opportunities, selectedTypeId, selectedPlaceId, colorsSelect) {
    if (!colorsSelect) return;
    
    // Находим соответствующую возможность печати
    const opportunity = opportunities.find(op => 
        op.print_type_id == selectedTypeId && op.print_place_id == selectedPlaceId
    );
    
    if (!opportunity) return;
    
    // Сохраняем текущее выбранное значение
    const currentValue = colorsSelect.value;
    
    // Очищаем текущие опции
    colorsSelect.innerHTML = '';
    
    // Добавляем опции в зависимости от максимального количества цветов
    for (let i = 1; i <= opportunity.color_quantity; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i === 1 ? '1 цвет' : 
                            (i > 1 && i < 5) ? i + ' цвета' : 
                            i + ' цветов';
        colorsSelect.appendChild(option);
    }
    
    // Добавляем опцию "Полноцвет" для определенных типов печати
    if (['sublimation', 'uv', 'digital'].includes(selectedTypeId)) {
        const option = document.createElement('option');
        option.value = 'full';
        option.textContent = 'Полноцвет';
        colorsSelect.appendChild(option);
    }
    
    // Восстанавливаем выбранное значение, если оно все еще доступно
    if (currentValue <= opportunity.color_quantity || 
        (currentValue === 'full' && ['sublimation', 'uv', 'digital'].includes(selectedTypeId))) {
        colorsSelect.value = currentValue;
    }
}

/**
 * Обновляет опции мест нанесения для всех элементов в контейнере
 * @param {HTMLElement} brandingContainer - Контейнер с брендированиями
 * @param {string} goodsId - ID товара
 */
function updateAllLocationOptionsInContainer(brandingContainer, goodsId) {
    if (!brandingContainer) return;
    
    const brandingItems = brandingContainer.querySelectorAll('.branding-item');
    const opportunities = printOpportunitiesCache.get(goodsId) || [];
    
    brandingItems.forEach(item => {
        const typeSelect = item.querySelector('.branding-type');
        const locationSelect = item.querySelector('.branding-location');
        
        if (typeSelect && locationSelect) {
            updateLocationOptions(opportunities, typeSelect.value, locationSelect, brandingContainer);
        }
    });
}

/**
 * Загрузка возможностей печати для товара
 * @param {string} goodsId - ID товара
 * @return {Promise} - Promise с данными о возможностях печати
 */
async function fetchPrintOpportunities(goodsId) {
    if (printOpportunitiesCache.has(goodsId)) {
        return printOpportunitiesCache.get(goodsId);
    }
    
    try {
        const response = await fetch(`/api/print-opportunities/${goodsId}`);
        const data = await response.json();
        
        if (data.success && data.opportunities) {
            printOpportunitiesCache.set(goodsId, data.opportunities);
            return data.opportunities;
        } else {
            console.error('Ошибка загрузки возможностей печати:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Ошибка загрузки возможностей печати:', error);
        return [];
    }
}
