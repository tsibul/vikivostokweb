/**
 * Cart Event Debugger
 * Модуль для отслеживания событий и координат кликов в элементах корзины
 */

// Минимизируем базовое логирование
console.log('CART DEBUGGER: Initialized');
const moduleLoadOrder = [];
const moduleInitOrder = [];
const canvasReadyEvents = []; // Для отслеживания событий canvas:ready

function registerModuleLoad(moduleName) {
    moduleLoadOrder.push({
        name: moduleName,
        timestamp: Date.now()
    });
    // Убираем лишний лог
}

// Регистрируем загрузку этого модуля
registerModuleLoad('eventDebugger.js');

/**
 * Отслеживание инициализации модулей
 */
export function registerModuleInit(moduleName, info = {}) {
    moduleInitOrder.push({
        name: moduleName,
        timestamp: Date.now(),
        ...info
    });
    // Оставляем только важный лог
    if (info.phase === 'completed') {
        console.log(`Module initialized: ${moduleName}`);
    }
}

/**
 * Регистрация обработчика события
 */
export function registerEventHandler(elementSelector, eventType, handlerModule) {
    const elements = document.querySelectorAll(elementSelector);
    
    elements.forEach(element => {
        // Сохраняем информацию об обработчике в dataset элемента для отладки
        if (!element.dataset.eventHandlers) {
            element.dataset.eventHandlers = JSON.stringify([]);
        }
        
        const handlers = JSON.parse(element.dataset.eventHandlers);
        handlers.push({
            type: eventType,
            module: handlerModule,
            timestamp: Date.now()
        });
        
        element.dataset.eventHandlers = JSON.stringify(handlers);
    });
    
    // Один лог для всех элементов
    if (elements.length > 0) {
        console.log(`Registered ${eventType} handler from ${handlerModule} on ${elements.length} elements`);
    }
}

/**
 * Расширенное логирование кликов на canvas
 */
document.addEventListener('click', function(event) {
    // Находим canvas среди целей клика
    let element = event.target;
    let depth = 0;
    
    while (element && depth < 5) {
        if (element.classList && element.classList.contains('cart-item-canvas')) {
            logCanvasClick(event, element);
            break; // Нашли canvas, дальше не ищем
        }
        
        element = element.parentElement;
        depth++;
    }
}, true); // Используем capture phase для перехвата всех событий

/**
 * Детальное логирование клика на canvas с координатами
 */
function logCanvasClick(event, canvas) {
    // Получаем rect канваса
    const rect = canvas.getBoundingClientRect();
    
    // Клиентские координаты (относительно viewport)
    const clientX = event.clientX;
    const clientY = event.clientY;
    
    // Координаты внутри canvas (с учетом позиции canvas на странице)
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;
    
    // Учитываем pixel ratio для точных координат внутри canvas
    const dpr = window.devicePixelRatio || 1;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Масштабированные координаты в пространстве canvas
    const scaledX = canvasX * scaleX / dpr;
    const scaledY = canvasY * scaleY / dpr;
    
    // Выводим в консоль с визуальным разделителем
    console.log('\n🔍 CANVAS CLICK DETECTED 🔍');
    console.log(`Canvas ID: ${canvas.dataset.itemId}, Index: ${canvas.dataset.index}`);
    console.log(`Canvas size: ${canvas.width / dpr}x${canvas.height / dpr}px (DPR: ${dpr})`);
    console.log(`Click coordinates:`);
    console.log(`  • Client: (${clientX.toFixed(1)}, ${clientY.toFixed(1)})px`);
    console.log(`  • Canvas: (${canvasX.toFixed(1)}, ${canvasY.toFixed(1)})px`);
    console.log(`  • Scaled: (${scaledX.toFixed(1)}, ${scaledY.toFixed(1)})px`);
    
    // Проверяем и выводим позиции интерактивных элементов
    try {
        logInteractiveElements(canvas, scaledX, scaledY);
    } catch (e) {
        console.error('Error logging interactive elements:', e);
    }
}

/**
 * Логирование интерактивных элементов и определение куда попал клик
 */
function logInteractiveElements(canvas, x, y) {
    // Проверяем наличие информации о кнопках в dataset
    const buttons = {
        minus: tryParseJson(canvas.dataset.minusBtn),
        plus: tryParseJson(canvas.dataset.plusBtn),
        input: tryParseJson(canvas.dataset.qtyInput),
        remove: tryParseJson(canvas.dataset.removeBtn),
        branding: tryParseJson(canvas.dataset.brandingBtn)
    };
    
    console.log('Interactive areas:');
    
    let hitArea = null;
    
    // Проверяем каждую область и определяем, куда попал клик
    Object.entries(buttons).forEach(([name, area]) => {
        if (!area || area.x === undefined) return;
        
        const isHit = x >= area.x && 
                      x <= (area.x + area.width) && 
                      y >= area.y && 
                      y <= (area.y + area.height);
        
        // Выводим координаты, включая центр элемента
        const centerInfo = area.centerX !== undefined 
            ? `, center: (${area.centerX.toFixed(1)}, ${area.centerY.toFixed(1)})` 
            : '';
            
        console.log(`  • ${name.padEnd(8)}: (${area.x.toFixed(1)}, ${area.y.toFixed(1)}, w:${area.width.toFixed(1)}, h:${area.height.toFixed(1)})${centerInfo} - ${isHit ? '✅ HIT' : '❌ MISS'}`);
        
        if (isHit) {
            hitArea = name;
        }
    });
    
    // Выводим итог - куда попал клик
    if (hitArea) {
        // Вычисляем расстояние от клика до центра элемента, если центр известен
        const hitElement = buttons[hitArea];
        let distanceInfo = '';
        
        if (hitElement.centerX !== undefined) {
            const dx = x - hitElement.centerX;
            const dy = y - hitElement.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            distanceInfo = `, расстояние от центра: ${distance.toFixed(1)}px`;
        }
        
        console.log(`\n✅ Click hit the ${hitArea.toUpperCase()} area${distanceInfo}`);
    } else {
        console.log('\n❌ Click did not hit any interactive area');
        
        // Находим ближайший элемент
        let closestElement = null;
        let minDistance = Infinity;
        
        Object.entries(buttons).forEach(([name, area]) => {
            if (!area || area.centerX === undefined) return;
            
            const dx = x - area.centerX;
            const dy = y - area.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestElement = name;
            }
        });
        
        if (closestElement) {
            console.log(`Closest element: ${closestElement.toUpperCase()}, distance: ${minDistance.toFixed(1)}px`);
        }
    }
    
    console.log('=== END OF CLICK DEBUG ===\n');
}

/**
 * Безопасный парсинг JSON
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
 * Отслеживание событий canvas:ready
 */
export function logCanvasReadyEvent(eventData, wasProcessed = true) {
    // Сохраняем информацию о событии
    canvasReadyEvents.push({
        timestamp: eventData.timestamp || Date.now(),
        canvasCount: eventData.canvasCount,
        source: eventData.source || 'unknown',
        processed: wasProcessed,
        time: new Date().toISOString()
    });
    
    // Ограничиваем размер массива
    if (canvasReadyEvents.length > 20) {
        canvasReadyEvents.shift();
    }
    
    // Выводим информацию о последних 5 событиях
    if (canvasReadyEvents.length >= 3) {
        console.log('\nCanvas:ready event history (last 3):');
        canvasReadyEvents.slice(-3).forEach((event, index) => {
            console.log(`${index + 1}. [${event.time.split('T')[1].substring(0, 12)}] source: ${event.source}, canvases: ${event.canvasCount}, ${event.processed ? '✓ processed' : '✗ skipped'}`);
        });
        console.log('');
    }
}

/**
 * Экспортируем историю инициализации
 */
export function getInitHistory() {
    return {
        moduleLoadOrder,
        moduleInitOrder,
        canvasReadyEvents
    };
}

// Экспортируем вспомогательные функции для отладки
export default {
    registerModuleLoad,
    registerModuleInit,
    registerEventHandler,
    getInitHistory
}; 