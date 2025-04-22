/**
 * Cart Item Events Module
 * Handles events on cart item canvas
 */

import eventBus from '../eventBus.js';
import { removeCartItem } from '../cartStorage.js';
import { registerModuleInit, logCanvasReadyEvent } from './eventDebugger.js';

// Регистрируем загрузку модуля
console.log('Loading cartItemEvents.js module - UI EVENTS HANDLER');

// Константы для типов событий
export const QUANTITY_EVENTS = {
    INCREASE: 'cart:quantity:increase',
    DECREASE: 'cart:quantity:decrease',
    CHANGE: 'cart:quantity:change'
};

// Флаг для отслеживания инициализации обработчиков
let handlersInitialized = false;

// Добавляем отслеживание уже обработанных событий canvas:ready
let lastProcessedEventTimestamp = 0;
let lastProcessedEventId = 0;
let debounceTimer = null;
const DEBOUNCE_DELAY = 150; // ms

// Храним информацию о canvas, на которые уже установлены обработчики
const canvasWithHandlers = new Set();

/**
 * Initialize event handlers for cart item canvases
 */
export function initCartItemEvents() {
    console.log('Initializing cart item events [cartItemEvents.js]');
    
    // Регистрируем инициализацию
    registerModuleInit('cartItemEvents.js', { phase: 'start' });
    
    // Подписываемся на события изменения количества
    if (!handlersInitialized) {
        console.log('Setting up canvas:ready event subscription');
        
        eventBus.subscribe('canvas:ready', (data) => {
            // Проверяем, не обрабатывали ли мы уже это событие
            if (data.id && data.id <= lastProcessedEventId) {
                console.log(`Skipping already processed canvas:ready event with id ${data.id}`);
                logCanvasReadyEvent(data, false); // Логируем пропущенное событие
                return;
            }
            
            // Проверяем по timestamp как дополнительный барьер
            if (data.timestamp && data.timestamp <= lastProcessedEventTimestamp) {
                console.log(`Skipping already processed canvas:ready event with timestamp ${data.timestamp}`);
                logCanvasReadyEvent(data, false);
                return;
            }
            
            // Используем debouncing для предотвращения множественных вызовов
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                console.log(`Received canvas:ready event, attaching handlers to ${data.canvasCount} canvases`);
                logCanvasReadyEvent(data, true); // Логируем обработанное событие
                
                // Сохраняем time и id последнего обработанного события
                lastProcessedEventTimestamp = data.timestamp || Date.now();
                if (data.id) {
                    lastProcessedEventId = data.id;
                }
                
                // Если в событии есть прямые ссылки на canvas элементы, используем их
                if (data.canvases && data.canvases.length > 0) {
                    console.log(`Using ${data.canvases.length} canvases passed directly in the event`);
                    
                    // Добавляем обработчики только к этим канвасам, не трогая остальные
                    data.canvases.forEach(canvas => {
                        attachHandlersToCanvas(canvas);
                    });
                } else {
                    // Иначе используем старый метод - ищем все канвасы на странице
                    attachEventHandlers();
                }
            }, DEBOUNCE_DELAY);
        });
        
        handlersInitialized = true;
    }
    
    // Регистрируем завершение инициализации
    registerModuleInit('cartItemEvents.js', { phase: 'completed' });
}

/**
 * Attach handlers to a specific canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function attachHandlersToCanvas(canvas) {
    if (!canvas || !canvas.dataset || !canvas.dataset.itemId) {
        console.warn('Attempted to attach handlers to invalid canvas', canvas);
        return;
    }
    
    const canvasId = canvas.dataset.itemId;
    
    // Remove existing event listeners to avoid duplicates
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
    
    // Add event listeners
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
    
    // Log interactive elements
    logCanvasInteractiveElements(canvas);
    
    // Mark as having handlers
    canvasWithHandlers.add(canvasId);
    
    console.log(`Attached handlers to canvas ID: ${canvasId}`);
}

/**
 * Attach event handlers to all canvas elements
 */
function attachEventHandlers() {
    // Удаляем оставшийся input, если страница перезагружается
    const existingInput = document.getElementById('canvas-qty-input');
    if (existingInput) {
        existingInput.remove();
    }
    
    // Get all canvas elements in the cart
    const canvases = document.querySelectorAll('.cart-item-canvas');
    console.log(`Attaching event handlers to ${canvases.length} cart item canvases`);
    
    canvases.forEach(canvas => {
        const canvasId = canvas.dataset.itemId;
        
        // Проверяем, не прикреплены ли уже обработчики к этому canvas
        if (canvasWithHandlers.has(canvasId)) {
            console.log(`Handlers already attached to canvas ${canvasId}, skipping`);
            
            // Важно: убедимся, что обработчики действительно привязаны к этому DOM-элементу
            // Возможно, что canvas был пересоздан, но ID остался прежним
            // В этом случае нужно переприкрепить обработчики
            
            // Для гарантии удаляем существующие обработчики
            canvas.removeEventListener('click', handleCanvasClick);
            canvas.removeEventListener('mousemove', handleCanvasMouseMove);
            canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
            
            // И добавляем их снова
            canvas.addEventListener('click', handleCanvasClick);
            canvas.addEventListener('mousemove', handleCanvasMouseMove);
            canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
            
            return;
        }
        
        // Remove existing event listener if any to avoid duplicates
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.removeEventListener('mousemove', handleCanvasMouseMove);
        canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
        
        // Add click event listener to handle all button clicks
        canvas.addEventListener('click', handleCanvasClick);
        console.log(`Added click handler to canvas ID: ${canvas.dataset.itemId}`);
        
        // Add hover effects for buttons by listening to mouse move
        canvas.addEventListener('mousemove', handleCanvasMouseMove);
        
        // Reset cursor when mouse leaves canvas
        canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
        
        // Выводим информацию о всех интерактивных элементах этого canvas
        logCanvasInteractiveElements(canvas);
        
        // Отмечаем canvas как обработанный
        canvasWithHandlers.add(canvasId);
    });
}

/**
 * Log interactive elements of a canvas for debugging
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function logCanvasInteractiveElements(canvas) {
    try {
        const itemId = canvas.dataset.itemId;
        console.log(`\n--- Canvas ${itemId} interactive elements ---`);
        
        // Получаем данные всех интерактивных элементов
        const elements = {
            minus: tryParseJson(canvas.dataset.minusBtn),
            plus: tryParseJson(canvas.dataset.plusBtn),
            input: tryParseJson(canvas.dataset.qtyInput),
            remove: tryParseJson(canvas.dataset.removeBtn),
            branding: tryParseJson(canvas.dataset.brandingBtn)
        };
        
        // Выводим центральные точки каждого элемента
        for (const [name, element] of Object.entries(elements)) {
            if (element && element.centerX !== undefined) {
                console.log(`${name.padEnd(10)}: center (${element.centerX.toFixed(1)}, ${element.centerY.toFixed(1)}), rect (${element.x.toFixed(1)}, ${element.y.toFixed(1)}, ${element.width.toFixed(1)}x${element.height.toFixed(1)})`);
            }
        }
        
        console.log(`--- End of canvas ${itemId} elements ---\n`);
    } catch (e) {
        console.error('Error logging canvas elements:', e);
    }
}

/**
 * Safe JSON parse with fallback
 * @param {string} json - JSON string to parse
 * @returns {Object|null} - Parsed object or null
 */
function tryParseJson(json) {
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

/**
 * Handle canvas click events
 * @param {MouseEvent} event - Click event
 */
function handleCanvasClick(event) {
    console.log('🔍 cartItemEvents.js click event handler');
    
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    
    // Рассчитываем клиентские координаты в области канваса
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;
    
    // DPR для учета плотности пикселей
    const dpr = window.devicePixelRatio || 1;
    
    // Преобразуем координаты клика в координаты канваса
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clientX * scaleX / dpr;
    const y = clientY * scaleY / dpr;
    
    console.log(`Click at (${x.toFixed(1)}, ${y.toFixed(1)}) on canvas ${canvas.dataset.itemId}`);
    
    // Получаем данные о позициях кнопок
    try {
        // Парсим позиции элементов из dataset
        const minusBtnPos = JSON.parse(canvas.dataset.minusBtn || '{}');
        const plusBtnPos = JSON.parse(canvas.dataset.plusBtn || '{}');
        const qtyInputPos = JSON.parse(canvas.dataset.qtyInput || '{}');
        const removeBtnPos = JSON.parse(canvas.dataset.removeBtn || '{}');
        const brandingBtnPos = JSON.parse(canvas.dataset.brandingBtn || '{}');
        
        console.log('Button positions from dataset:');
        console.log('Minus:', minusBtnPos);
        console.log('Plus:', plusBtnPos);
        console.log('Input:', qtyInputPos);
        console.log('Remove:', removeBtnPos);
        console.log('Branding:', brandingBtnPos);
        
        // Определяем область клика напрямую (без вспомогательных функций)
        const padding = 5; // Увеличиваем зону клика для лучшего срабатывания на мобильных устройствах
        
        // Проверяем клик на кнопку минус
        if (x >= (minusBtnPos.x - padding) && 
            x <= (minusBtnPos.x + minusBtnPos.width + padding) &&
            y >= (minusBtnPos.y - padding) &&
            y <= (minusBtnPos.y + minusBtnPos.height + padding)) {
            
            console.log('📉 Minus button clicked');
            handleMinusButtonClick(canvas);
            return;
        }
        
        // Проверяем клик на кнопку плюс
        if (x >= (plusBtnPos.x - padding) && 
            x <= (plusBtnPos.x + plusBtnPos.width + padding) &&
            y >= (plusBtnPos.y - padding) &&
            y <= (plusBtnPos.y + plusBtnPos.height + padding)) {
            
            console.log('📈 Plus button clicked');
            handlePlusButtonClick(canvas);
            return;
        }
    
        // Проверяем клик на поле ввода количества
        if (x >= (qtyInputPos.x - padding) && 
            x <= (qtyInputPos.x + qtyInputPos.width + padding) &&
            y >= (qtyInputPos.y - padding) &&
            y <= (qtyInputPos.y + qtyInputPos.height + padding)) {
            
            console.log('📝 Quantity input field clicked');
            handleInputFieldClick(canvas);
            return;
        }
    
        // Проверяем клик на кнопку удаления
        if (x >= (removeBtnPos.x - padding) && 
            x <= (removeBtnPos.x + removeBtnPos.width + padding) &&
            y >= (removeBtnPos.y - padding) &&
            y <= (removeBtnPos.y + removeBtnPos.height + padding)) {
            
            console.log('🗑️ Remove button clicked');
            handleRemoveItem(canvas);
            return;
        }
        
        // Проверяем клик на кнопку брендирования
        if (brandingBtnPos && 
            x >= (brandingBtnPos.x - padding) && 
            x <= (brandingBtnPos.x + brandingBtnPos.width + padding) &&
            y >= (brandingBtnPos.y - padding) &&
            y <= (brandingBtnPos.y + brandingBtnPos.height + padding)) {
            
            console.log('🏷️ Branding button clicked');
            // Здесь будет код для брендирования
            return;
        }
    
        // Проверяем клик на брендирование
        const brandingBtns = JSON.parse(canvas.dataset.brandingBtns || '{}');
        const brandingBtnKeys = Object.keys(brandingBtns);
    
        for (const key of brandingBtnKeys) {
            const btnPos = brandingBtns[key];
                
            if (x >= (btnPos.x - padding) && 
                x <= (btnPos.x + btnPos.width + padding) &&
                y >= (btnPos.y - padding) && 
                y <= (btnPos.y + btnPos.height + padding)) {
                    
                if (key.includes('remove')) {
                    console.log('🧹 Branding remove button clicked');
                    handleRemoveBranding(canvas, btnPos.index);
                } else if (key.includes('checkbox')) {
                    console.log('☑️ Branding checkbox clicked');
                    handleToggleSecondPass(canvas, btnPos.index);
                }
                return;
            }
        }
        
        console.log('⚠️ Click not on any interactive element');
        
    } catch (e) {
        console.error('Error processing canvas click:', e);
    }
}

/**
 * Handle click on minus button - emits quantity decrease event
 */
function handleMinusButtonClick(canvas) {
    const itemId = canvas.dataset.itemId;
    if (!itemId) return;
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(item => item.id === itemId);
    
    if (item && item.quantity > 1) {
        // Только эмитируем событие, не меняем напрямую
        const newQuantity = item.quantity - 1;
        console.log(`Emitting quantity decrease event for item ${itemId}, from ${item.quantity} to ${newQuantity}`);
        
        // Эмитируем событие уменьшения количества
        eventBus.publish(QUANTITY_EVENTS.DECREASE, {
            itemId: itemId,
            quantity: newQuantity,
            previousQuantity: item.quantity
        });
    } else {
        console.log('Cannot decrease quantity below 1');
    }
}

/**
 * Handle click on plus button - emits quantity increase event
 */
function handlePlusButtonClick(canvas) {
    const itemId = canvas.dataset.itemId;
    console.log('DEBUG-PLUS: handlePlusButtonClick called for itemId', itemId);
    
    if (!itemId) {
        console.error('DEBUG-PLUS: No itemId found in canvas dataset');
        return;
    }
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('DEBUG-PLUS: Cart items from localStorage', cartItems);
    
    const item = cartItems.find(item => item.id === itemId);
    console.log('DEBUG-PLUS: Found item in cart', item);
    
    if (item) {
        // Только эмитируем событие, не меняем напрямую
        const newQuantity = item.quantity + 1;
        console.log(`DEBUG-PLUS: Emitting quantity increase event for item ${itemId}, from ${item.quantity} to ${newQuantity}`);
        
        // Проверяем константу события
        console.log('DEBUG-PLUS: Event constant value', QUANTITY_EVENTS.INCREASE);
        
        // Эмитируем событие увеличения количества
        const eventData = {
            itemId: itemId,
            quantity: newQuantity,
            previousQuantity: item.quantity
        };
        console.log('DEBUG-PLUS: Publishing event with data', eventData);
        
        try {
            eventBus.publish(QUANTITY_EVENTS.INCREASE, eventData);
            console.log('DEBUG-PLUS: Event published successfully');
        } catch (e) {
            console.error('DEBUG-PLUS: Error publishing event', e);
        }
    } else {
        console.error('DEBUG-PLUS: Item not found in cart for ID', itemId);
    }
}

/**
 * Handle click on quantity input field
 */
function handleInputFieldClick(canvas) {
    const itemId = canvas.dataset.itemId;
    if (!itemId) return;
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cartItems.find(item => item.id === itemId);
    
    if (item) {
        console.log('Creating quantity input field');
        createQuantityInputElement(canvas, item);
    }
}

/**
 * Create and position a real input element over the canvas quantity area
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 * @returns {HTMLInputElement} The created input element
 */
function createQuantityInputElement(canvas, item) {
    // Удаляем существующий input, если есть
    const existingInput = document.getElementById('canvas-qty-input');
    if (existingInput) {
        existingInput.remove();
    }
    
    // Получаем данные о позиции поля ввода
    const qtyInputPos = JSON.parse(canvas.dataset.qtyInput || '{}');
    if (!qtyInputPos.x) {
        console.error('No quantity input position data found');
        return null;
    }
    
    // Получаем размеры и позицию canvas
    const canvasRect = canvas.getBoundingClientRect();
    
    // Создаем input элемент
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'canvas-qty-input';
    input.value = item.quantity;
    input.min = '1';
    input.style.position = 'absolute';
    
    // Учитываем devicePixelRatio для правильного позиционирования
    const dpr = window.devicePixelRatio || 1;
    
    // Устанавливаем размеры для 6-значных чисел
    const inputWidth = Math.max(80, qtyInputPos.width / dpr);
    input.style.width = `${inputWidth}px`;
    input.style.height = `${qtyInputPos.height / dpr}px`;
    
    // Вычисляем позицию с учетом прокрутки страницы
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Позиционируем input над областью quantity на canvas
    input.style.left = `${canvasRect.left + (qtyInputPos.x / dpr) + scrollX}px`;
    input.style.top = `${canvasRect.top + (qtyInputPos.y / dpr) + scrollY}px`;
    
    // Стилизуем input
    input.style.border = '2px solid #00a3c0';
    input.style.borderRadius = '4px';
    input.style.background = '#ffffff';
    input.style.color = '#0F4880';
    input.style.fontFamily = 'Montserrat, sans-serif';
    input.style.fontSize = '14px';
    input.style.padding = '0 4px';
    input.style.margin = '0';
    input.style.textAlign = 'center';
    input.style.boxSizing = 'border-box';
    input.style.zIndex = '1000';
    input.style.outline = 'none';
    
    // Устанавливаем максимальную длину ввода
    input.setAttribute('maxlength', '6');
    
    // Добавляем input на страницу
    document.body.appendChild(input);
    
    // Помечаем canvas как редактируемый
    canvas.dataset.isEditing = 'true';
    
    // Сохраняем ссылку на canvas в input для использования при обработке событий
    input.dataset.canvasId = canvas.dataset.itemId;
    
    // Обработчик для поля ввода
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            applyQuantityChangeFromInput(input);
        } else if (e.key === 'Escape') {
            input.remove();
            canvas.dataset.isEditing = 'false';
        }
    });
    
    // Применить изменения при потере фокуса
    input.addEventListener('blur', function() {
        applyQuantityChangeFromInput(input);
    });
    
    // Фокусируем и выделяем текст
    try {
        input.focus();
        input.select();
    } catch (e) {
        console.error('Error focusing input:', e);
    }
    
    return input;
}

/**
 * Apply quantity changes from the real input element and emit quantity change event
 * @param {HTMLInputElement} input - Input element
 */
function applyQuantityChangeFromInput(input) {
    // Получаем значение
    let quantity = parseInt(input.value, 10);
    
    // Проверяем на корректность
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }
    
    // Получаем canvas по id
    const canvasId = input.dataset.canvasId;
    const canvas = document.querySelector(`.cart-item-canvas[data-item-id="${canvasId}"]`);
    
    if (canvas) {
        // Снимаем флаг редактирования
        canvas.dataset.isEditing = 'false';
        
        // Получаем текущие данные
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cartItems.find(item => item.id === canvasId);
        
        if (item) {
            // Эмитируем событие изменения количества
            console.log(`Emitting quantity change event for item ${canvasId}, from ${item.quantity} to ${quantity}`);
            
            eventBus.publish(QUANTITY_EVENTS.CHANGE, {
                itemId: canvasId,
                quantity: quantity,
                previousQuantity: item.quantity,
                source: 'input'
            });
        }
    }
    
    // Удаляем input
    input.remove();
}

/**
 * Handle canvas mouse move events for hover effects
 * @param {MouseEvent} event - Mouse move event
 */
function handleCanvasMouseMove(event) {
    const canvas = event.currentTarget;
    
    const rect = canvas.getBoundingClientRect();
    
    // Calculate position in canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const dpr = window.devicePixelRatio || 1;
    const x = (event.clientX - rect.left) * scaleX / dpr;
    const y = (event.clientY - rect.top) * scaleY / dpr;
    
    // Check all buttons with wide padding for better UX
    let isOverButton = false;
    const padding = 5;
    
    try {
        const minusBtnPos = JSON.parse(canvas.dataset.minusBtn || '{}');
        const plusBtnPos = JSON.parse(canvas.dataset.plusBtn || '{}');
        const removeBtnPos = JSON.parse(canvas.dataset.removeBtn || '{}');
        const qtyInputPos = JSON.parse(canvas.dataset.qtyInput || '{}');
    
        // Check if mouse is over any of the standard buttons
        if ((minusBtnPos.x && x >= (minusBtnPos.x - padding) && 
             x <= (minusBtnPos.x + minusBtnPos.width + padding) &&
             y >= (minusBtnPos.y - padding) && 
             y <= (minusBtnPos.y + minusBtnPos.height + padding)) ||
            
            (plusBtnPos.x && x >= (plusBtnPos.x - padding) && 
             x <= (plusBtnPos.x + plusBtnPos.width + padding) &&
             y >= (plusBtnPos.y - padding) && 
             y <= (plusBtnPos.y + plusBtnPos.height + padding)) ||
            
            (removeBtnPos.x && x >= (removeBtnPos.x - padding) && 
             x <= (removeBtnPos.x + removeBtnPos.width + padding) &&
             y >= (removeBtnPos.y - padding) && 
             y <= (removeBtnPos.y + removeBtnPos.height + padding)) ||
            
            (qtyInputPos.x && x >= (qtyInputPos.x - padding) && 
             x <= (qtyInputPos.x + qtyInputPos.width + padding) &&
             y >= (qtyInputPos.y - padding) && 
             y <= (qtyInputPos.y + qtyInputPos.height + padding))) {
            
            isOverButton = true;
        }
    
        // Check branding buttons if any
        if (!isOverButton) {
            const brandingBtns = JSON.parse(canvas.dataset.brandingBtns || '{}');
            const brandingBtnKeys = Object.keys(brandingBtns);
                
            for (const key of brandingBtnKeys) {
                const btnPos = brandingBtns[key];
                    
                if (x >= (btnPos.x - padding) && 
                    x <= (btnPos.x + btnPos.width + padding) &&
                    y >= (btnPos.y - padding) && 
                    y <= (btnPos.y + btnPos.height + padding)) {
                        
                    isOverButton = true;
                    break;
                }
            }
        }
    } catch (e) {
        console.error('Error in mousemove handling:', e);
    }
    
    // Update cursor based on whether we're over a button
    canvas.style.cursor = isOverButton ? 'pointer' : 'default';
}

/**
 * Handle canvas mouse leave events
 * @param {MouseEvent} event - Mouse leave event
 */
function handleCanvasMouseLeave(event) {
    const canvas = event.currentTarget;
    canvas.style.cursor = 'default';
}

/**
 * Handle remove item button
 * @param {HTMLCanvasElement} canvas - Cart item canvas
 */
function handleRemoveItem(canvas) {
    const itemId = canvas.dataset.itemId;
    if (!itemId) return;
    
    // Remove item from storage
    removeCartItem(itemId);
    
    // Remove canvas from DOM
    const canvasContainer = canvas.closest('.cart-item');
    if (canvasContainer) {
        canvasContainer.remove();
    }
    
    // If cart is empty, show empty message
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartItems.length === 0) {
        const container = document.querySelector('.cart-page__items');
        if (container) {
            const emptyCart = document.createElement('div');
            emptyCart.className = 'cart-empty';
            emptyCart.innerHTML = `
                <div class="cart-empty__icon">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>
                <h2 class="cart-empty__title">Ваша корзина пуста</h2>
                <p class="cart-empty__text">Добавьте товары в корзину, чтобы оформить заказ</p>
                <a href="/catalog/" class="btn btn-primary cart-empty__button">Перейти в каталог</a>
            `;
            container.appendChild(emptyCart);
            
            // Hide summary
            const summary = document.querySelector('.cart-summary');
            if (summary) {
                summary.classList.add('item-hidden');
            }
        }
    }
}

/**
 * Handle remove branding button
 * @param {HTMLCanvasElement} canvas - Cart item canvas
 * @param {number} brandingIndex - Branding item index
 */
function handleRemoveBranding(canvas, brandingIndex) {
    const itemId = canvas.dataset.itemId;
    if (!itemId || brandingIndex === undefined) return;
    
    // Эмитируем событие удаления брендирования
    eventBus.publish('cart:branding:remove', {
        itemId: itemId,
        brandingIndex: brandingIndex
    });
}

/**
 * Handle toggle second pass checkbox
 * @param {HTMLCanvasElement} canvas - Cart item canvas
 * @param {number} brandingIndex - Branding item index
 */
function handleToggleSecondPass(canvas, brandingIndex) {
    const itemId = canvas.dataset.itemId;
    if (!itemId || brandingIndex === undefined) return;
    
    // Эмитируем событие переключения брендирования
    eventBus.publish('cart:branding:toggle', {
        itemId: itemId,
        brandingIndex: brandingIndex
    });
}

// Initialize events when DOM is ready
document.addEventListener('DOMContentLoaded', initCartItemEvents);

// Subscribe to cart update events
eventBus.subscribe('cart:updated', () => {
    initCartItemEvents();
});
