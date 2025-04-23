/**
 * Main Cart Module
 * Handles all cart functionality
 */

// Импортируем необходимые модули корзины
import { getCartItems, updateCartBadge, STORAGE_EVENTS } from './cartStorage.js';
import { initPriceCalculator } from './pricing/productPriceCalculator.js';
import { initCartRendering } from './cartItem/cartItemRenderer.js';
import { initCartItemEvents } from './cartItem/cartItemEvents.js';
import { initQuantityInputHandlers } from './cartItem/cartItemQuantity.js';
import { registerModuleInit } from './cartItem/eventDebugger.js';
import { initCartSummary } from './summary/index.js';
import { initPriceUpdateManager } from './cartItem/priceUpdateManager.js';
import eventBus from './eventBus.js';

// Глобальные данные о возможностях печати
let printOpportunities = [];

/**
 * Загрузка данных о возможностях печати
 */
export async function loadPrintOpportunities() {
    try {
        // Получаем товары из корзины
        const cartItems = getCartItems();
        
        if (!cartItems || cartItems.length === 0) {
            console.log('No items in cart, skipping print opportunities load');
            return [];
        }
        
        // Результаты для всех товаров
        const allOpportunities = [];
        
        // Загружаем данные для каждого товара
        for (const item of cartItems) {
            const goodsId = item.id;
            
            if (!goodsId) {
                console.warn('Item has no ID, skipping print opportunities', item);
                continue;
            }
            
            console.log(`Loading print opportunities for goods ID: ${goodsId}`);
            
            try {
                const response = await fetch(`/api/print-opportunities/${goodsId}`);
                
                if (!response.ok) {
                    console.warn(`Failed to load print opportunities for goods ID: ${goodsId}`);
                    continue;
                }
                
                // Получаем данные из ответа
                const responseData = await response.json();
                
                // Извлекаем массив возможностей из ответа
                const itemOpportunities = responseData.opportunities || [];
                
                // Добавляем ID товара к каждой возможности
                const opportunitiesWithId = itemOpportunities.map(opp => ({
                    ...opp,
                    goodsId: goodsId
                }));
                
                allOpportunities.push(...opportunitiesWithId);
            } catch (itemError) {
                console.warn(`Error loading print opportunities for goods ID: ${goodsId}`, itemError);
            }
        }
        
        // Сохраняем все возможности
        printOpportunities = allOpportunities;
        
        console.log('Loaded print opportunities:', printOpportunities);
        return printOpportunities;
    } catch (error) {
        console.error('Error loading print opportunities:', error);
        return [];
    }
}

/**
 * Get print opportunities
 * @returns {Array} Print opportunities
 */
export function getPrintOpportunities() {
    return printOpportunities;
}

/**
 * Initialize cart functionality
 */
export function initCart() {
    // Check if we're on the cart page
    const cartContainer = document.querySelector('.cart-page__items');
    
    if (cartContainer) {
        console.log('Cart container found, initializing cart');
        
        // Регистрируем инициализацию для отладки
        registerModuleInit('index.js', { phase: 'start' });
        
        // Инициализация менеджера обновления цен
        initPriceUpdateManager();
        
        // Инициализация рендеринга корзины
        initCartRendering();
        
        // Инициализация обработчиков событий
        initCartItemEvents();
        
        // Инициализация обработчиков ввода количества
        initQuantityInputHandlers();
        
        // Инициализация калькулятора цен
        initPriceCalculator();
        
        // Инициализация блока суммы корзины
        initCartSummary();
        
        // Регистрируем завершение инициализации
        registerModuleInit('index.js', { phase: 'completed' });
    } else {
        console.log('Not on cart page, initialize only core functionality');
    }
    
    // Публикуем событие инициализации корзины
    eventBus.publish('cart:initialized', { timestamp: Date.now() });
    console.log('Cart initialization completed, published cart:initialized event');
}

// Реэкспорт функций и констант
export { getCartItems, updateCartBadge };
