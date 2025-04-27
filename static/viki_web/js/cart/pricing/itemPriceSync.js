/**
 * Item Price Synchronization Module
 * Handles synchronizing prices for a single cart item
 */

import eventBus from '../eventBus.js';
import { fetchPrintOpportunities, getBrandingPrice } from '../branding/brandingOptionsManager.js';
import { STORAGE_EVENTS } from '../cartStorage.js';

// Событие обновления цен брендирования
export const BRANDING_PRICE_EVENTS = {
    ITEM_BRANDING_UPDATED: 'item:branding:price:updated'
};

/**
 * Обновление цен брендирования при изменении количества товара
 * @param {string} itemId - ID товара
 * @param {number} quantity - Новое количество товара
 * @returns {Promise<boolean>} Результат обновления
 */
export async function updateItemBrandingPrices(itemId, quantity) {
    try {
        // Получаем товары из корзины
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            return false;
        }
        
        const item = cartItems[itemIndex];
        
        // Если у товара нет брендирования, нечего обновлять
        if (!item.branding || item.branding.length === 0) {
            return false;
        }
        
        // Получаем возможности печати для товара
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
                quantity
            );
            
            // Если цена изменилась, обновляем её
            if (branding.price !== newPrice) {
                cartItems[itemIndex].branding[i].price = newPrice;
                brandingUpdated = true;
            }
        }
        
        // Если были изменения, сохраняем обновленную корзину
        if (brandingUpdated) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            
            // Публикуем событие об обновлении цен брендирования
            eventBus.publish(BRANDING_PRICE_EVENTS.ITEM_BRANDING_UPDATED, {
                itemId,
                item: cartItems[itemIndex],
                index: itemIndex,
                timestamp: Date.now()
            });
            
            // Также публикуем стандартное событие обновления товара в корзине
            eventBus.publish(STORAGE_EVENTS.CART_ITEM_UPDATED, {
                item: cartItems[itemIndex],
                index: itemIndex
            });
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error updating item branding prices:', error);
        return false;
    }
}

/**
 * Инициализация обработчиков событий
 * Подписка на события изменения количества товара
 */
export function initItemPriceSync() {
    // Подписываемся на событие изменения количества товара
    eventBus.subscribe('cart:quantity:increase', handleQuantityChange);
    eventBus.subscribe('cart:quantity:decrease', handleQuantityChange);
    eventBus.subscribe('cart:quantity:change', handleQuantityChange);
}

/**
 * Обработчик события изменения количества товара
 * @param {Object} data - Данные события {itemId, quantity}
 */
function handleQuantityChange(data) {
    if (data && data.itemId && data.quantity) {
        // Обновляем цены брендирования для измененного товара
        updateItemBrandingPrices(data.itemId, data.quantity);
    }
} 