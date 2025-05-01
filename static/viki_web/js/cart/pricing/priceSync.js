/**
 * Price Synchronization Module
 * Handles synchronizing product and branding prices before rendering cart
 */

import eventBus from '../eventBus.js';
import { fetchProductPrice, calculateProductPrice } from './productPriceCalculator.js';
import { fetchPrintOpportunities, getBrandingPrice } from '../branding/brandingOptionsManager.js';

// Событие завершения синхронизации цен
export const PRICE_SYNC_EVENTS = {
    SYNC_COMPLETE: 'price:sync:complete'
};

/**
 * Синхронизация цен всей корзины
 * Обновляет цены товаров и брендирования перед рендерингом
 * @returns {Promise<boolean>} Результат синхронизации
 */
export async function syncCartPrices() {
    try {
        // Получаем товары из корзины
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cartItems || cartItems.length === 0) {
            // Корзина пуста, нечего синхронизировать
            eventBus.publish(PRICE_SYNC_EVENTS.SYNC_COMPLETE, { 
                success: true, 
                updatedItems: [], 
                timestamp: Date.now() 
            });
            return true;
        }
        
        // Обновляем каждый товар последовательно
        const updatedItems = [];
        
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            
            // Флаг изменения любых цен для данного товара
            let itemUpdated = false;
            
            // 1. Синхронизация основной цены товара
            const priceUpdated = await syncProductPrice(item, cartItems, i);
            itemUpdated = itemUpdated || priceUpdated;
            
            // 2. Синхронизация цен брендирования
            const brandingUpdated = await syncBrandingPrices(item, cartItems, i);
            itemUpdated = itemUpdated || brandingUpdated;
            
            // Если были изменения, добавляем товар в список обновленных
            if (itemUpdated) {
                updatedItems.push(item.id);
            }
        }
        
        // Публикуем событие о завершении синхронизации
        eventBus.publish(PRICE_SYNC_EVENTS.SYNC_COMPLETE, {
            success: true,
            updatedItems,
            timestamp: Date.now()
        });
        
        return true;
    } catch (error) {
        console.error('Error synchronizing cart prices:', error);
        
        // Публикуем событие с ошибкой
        eventBus.publish(PRICE_SYNC_EVENTS.SYNC_COMPLETE, {
            success: false,
            error: error.message,
            timestamp: Date.now()
        });
        
        return false;
    }
}

/**
 * Синхронизация цены товара
 * @param {Object} item - Товар в корзине
 * @param {Array} cartItems - Все товары в корзине
 * @param {number} index - Индекс товара в массиве
 * @returns {Promise<boolean>} Были ли изменения в цене
 */
async function syncProductPrice(item, cartItems, index) {
    try {
        // Получаем актуальные данные о цене товара
        const priceData = await fetchProductPrice(Number.parseInt(item.id));
        
        if (!priceData) {
            return false;
        }
        
        // Рассчитываем цену на основе количества
        const newPrice = calculateProductPrice(priceData, item.quantity);
        
        // Проверяем, изменилась ли скидка
        const oldDiscountPrice = item.discountPrice;
        const discountChanged = oldDiscountPrice !== undefined && oldDiscountPrice !== newPrice;
        
        // Сбрасываем цену со скидкой до базовой всегда
        cartItems[index].discountPrice = newPrice;
        
        // Если цена изменилась, обновляем данные
        if (item.price !== newPrice) {
            cartItems[index].price = newPrice;
            
            // Сохраняем обновленную корзину
            localStorage.setItem('cart', JSON.stringify(cartItems));
            
            return true;
        }
        
        // Сохраняем корзину, если была сброшена скидка
        if (discountChanged) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            return true;
        }
        
        return false;
    } catch (error) {
        console.warn(`Failed to sync price for item ${item.id}:`, error);
        return false;
    }
}

/**
 * Синхронизация цен брендирования
 * @param {Object} item - Товар в корзине
 * @param {Array} cartItems - Все товары в корзине
 * @param {number} index - Индекс товара в массиве
 * @returns {Promise<boolean>} Были ли изменения в ценах брендирования
 */
async function syncBrandingPrices(item, cartItems, index) {
    try {
        // Если у товара нет брендирования, нечего синхронизировать
        if (!item.branding || item.branding.length === 0) {
            return false;
        }
        
        // Получаем возможности печати для данного товара
        const goodsId = item.goodsId || item.id;
        const opportunities = await fetchPrintOpportunities(goodsId);
        
        if (!opportunities || opportunities.length === 0) {
            return false;
        }
        
        // Флаг изменения цен брендирования
        let brandingUpdated = false;
        
        // Обновляем цены для каждого брендирования
        for (let i = 0; i < item.branding.length; i++) {
            const branding = item.branding[i];
            
            // Получаем актуальную цену брендирования
            const typeId = branding.typeId || branding.type_id;
            const locationId = branding.locationId || branding.location_id;
            const colorCount = branding.colors || 1;
            
            const newPrice = getBrandingPrice(
                opportunities, 
                typeId, 
                locationId, 
                colorCount, 
                item.quantity
            );
            
            // Если цена изменилась, обновляем её
            if (branding.price !== newPrice) {
                cartItems[index].branding[i].price = newPrice;
                brandingUpdated = true;
            }
        }
        
        // Если были изменения, сохраняем обновленную корзину
        if (brandingUpdated) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            return true;
        }
        
        return false;
    } catch (error) {
        console.warn(`Failed to sync branding prices for item ${item.id}:`, error);
        return false;
    }
} 