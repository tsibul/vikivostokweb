import eventBus from '../eventBus.js';
import { QUANTITY_EVENTS } from './cartItemEvents.js';
import { STORAGE_EVENTS } from '../cartStorage.js';

// Определяем новое событие для управления обновлением интерфейса
export const UPDATE_EVENTS = {
    PRICE_CALCULATION_COMPLETE: 'price:calculation:complete',
    UPDATE_UI_REQUESTED: 'update:ui:requested'
};

/**
 * Инициализация менеджера обновления цен
 */
export function initPriceUpdateManager() {
    // Слушаем события изменения количества
    eventBus.subscribe(QUANTITY_EVENTS.INCREASE, handleQuantityChange);
    eventBus.subscribe(QUANTITY_EVENTS.DECREASE, handleQuantityChange);
    eventBus.subscribe(QUANTITY_EVENTS.SET, handleQuantityChange);
    
    // Слушаем завершение расчета цены
    eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_UPDATED, handlePriceUpdated);
}

/**
 * Обработчик события изменения количества товара
 * @param {Object} data - Данные события
 */
function handleQuantityChange(data) {
    // При изменении количества мы только запоминаем, что интерфейс нужно обновить
    // но не запускаем обновление немедленно
    // Фактически блокируем немедленное обновление интерфейса
    
    // Уведомляем систему, что требуется расчет цены
    eventBus.publish(UPDATE_EVENTS.UPDATE_UI_REQUESTED, {
        itemId: data.itemId,
        pending: true
    });
}

/**
 * Обработчик события обновления цены
 * @param {Object} data - Данные события
 */
function handlePriceUpdated(data) {
    // Когда цена рассчитана и обновлена в хранилище,
    // публикуем событие о завершении расчета
    
    eventBus.publish(UPDATE_EVENTS.PRICE_CALCULATION_COMPLETE, {
        item: data.item,
        index: data.index,
        pending: false
    });
} 