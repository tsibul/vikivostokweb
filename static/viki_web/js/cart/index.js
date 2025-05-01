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
import { initBranding } from './branding/brandingInit.js';
import eventBus from './eventBus.js';
// import { initBrandingAdd } from './branding/brandingAdd.js';
import initBrandingButtonManager from './branding/brandingButtonManager.js';
// Импортируем модули синхронизации цен
import { syncCartPrices, PRICE_SYNC_EVENTS } from './pricing/priceSync.js';
import { initItemPriceSync } from './pricing/itemPriceSync.js';
// Импортируем модуль управления скидками
import { initDiscountManager } from './pricing/discountManager.js';

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
        
        // console.log('Loaded print opportunities:', printOpportunities);
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
 * Initialize all cart functionality
 */
export function initCart() {
    // Initialize branding functionality
    // initBrandingAdd();
    
    // Initialize branding button manager
    initBrandingButtonManager();
    
    // Инициализируем синхронизацию цен брендирования при изменении количества товара
    initItemPriceSync();
    
    // Инициализируем модуль управления скидками
    initDiscountManager();
    
    // Check if we're on the cart page
    const cartContainer = document.querySelector('.cart-page__items');
    
    if (cartContainer) {
        // Регистрируем инициализацию для отладки
        registerModuleInit('index.js', { phase: 'start' });
        
        // Инициализация менеджера обновления цен
        initPriceUpdateManager();
        
        // Настраиваем подписку на событие завершения синхронизации цен
        eventBus.subscribe(PRICE_SYNC_EVENTS.SYNC_COMPLETE, () => {
            // После обновления цен инициализируем рендеринг и все остальное
            
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
            
            // Инициализация функционала брендирования
            initBranding();
            
            // Регистрируем завершение инициализации
            registerModuleInit('index.js', { phase: 'completed' });
        });
        
        // Запускаем синхронизацию цен перед отображением корзины
        syncCartPrices();
    } else {
        // Для страниц без корзины может быть свой код инициализации
    }
    
    // Публикуем событие инициализации корзины
    eventBus.publish('cart:initialized', { timestamp: Date.now() });
}

// Реэкспорт функций и констант
export { getCartItems, updateCartBadge };
