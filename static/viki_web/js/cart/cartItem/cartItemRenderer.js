/**
 * Cart Item Renderer Module
 * Handles rendering cart items using Canvas
 */

import eventBus from '../eventBus.js';
import {formatPrice} from '../pricing/priceFormatter.js';
import {STORAGE_EVENTS} from '../cartStorage.js';
import {logCanvasReadyEvent} from './eventDebugger.js';
import {UPDATE_EVENTS} from './priceUpdateManager.js';

// Flag to track font loading status
let isFontLoaded = false;

// Configuration for canvas rendering
const CONFIG = {
    itemMinHeight: 186,
    imageSize: 70,
    padding: 16,
    borderRadius: 6,
    borderColor: 'transparent',
    backgroundColor: '#ffffff',
    textColor: '#0F4880',
    headerColor: '#0F4880',
    accentColor: '#00a3c0',
    buttonBackground: '#F2FFFF',
    buttonBorder: 'transparent',
    imageBackground: '#ffffff',
    fontFamily: 'Montserrat, sans-serif',
    fallbackFont: 'Arial, sans-serif',
    // Размеры шрифтов для разных элементов
    headerFontSize: 16,            // Размер заголовка 
    textFontSize: 14,              // Размер обычного текста
    priceFontSize: 15              // Размер для цен
};

/**
 * Check if font is available and load it if needed
 * @returns {Promise<void>} Promise that resolves when font is loaded
 */
async function ensureFontLoaded() {
    if (isFontLoaded) return Promise.resolve();

    return new Promise((resolve) => {
        // Try to use the FontFace API if available
        if (typeof FontFace !== 'undefined') {
            // Check if font is already loaded in document
            document.fonts.ready.then(() => {
                if (document.fonts.check(`12px ${CONFIG.fontFamily}`)) {
                    isFontLoaded = true;
                    resolve();
                    return;
                }

                // Font not loaded yet, try to load it
                try {
                    const font = new FontFace('Montserrat', 'url(/static/viki_web/fonts/Montserrat-Regular.woff2)');
                    font.load().then(() => {
                        document.fonts.add(font);
                        isFontLoaded = true;
                        resolve();
                    }).catch(() => {
                        // If font loading fails, use fallback
                        resolve();
                    });
                } catch (e) {
                    // FontFace API failed, use fallback
                    resolve();
                }
            });
        } else {
            // FontFace API not available, use fallback immediately
            resolve();
        }
    });
}

/**
 * Get current font to use based on loading status
 * @returns {string} Font family to use
 */
function getCurrentFont() {
    return isFontLoaded ? CONFIG.fontFamily : CONFIG.fallbackFont;
}

/**
 * Calculate optimal canvas width based on container width
 * @param {HTMLElement} container - Container element for canvas
 * @returns {number} Optimal canvas width
 */
function calculateCanvasWidth(container) {
    // Если контейнер недоступен, используем ширину окна или фиксированное значение
    if (!container) {
        // Используем ширину окна с отступами или фиксированную ширину
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || 800;
        return Math.min(Math.max(windowWidth - 40, 300), 1200);
    }

    // Получаем родительский контейнер
    const parentWidth = container.parentElement ? container.parentElement.offsetWidth : container.offsetWidth;

    // Для десктоп-версии используем полную ширину контейнера минус отступы
    return Math.max(parentWidth - 2, 300);
}

/**
 * Calculate optimal canvas height based on content
 * @param {Object} item - Cart item data
 * @returns {number} Optimal canvas height
 */
function calculateCanvasHeight(item) {
    // Base height for item with no branding
    let height = CONFIG.itemMinHeight;

    // Add additional height for branding if exists
    if (item.branding && item.branding.length > 0) {
        // 50px base + 35px per branding item
        height += 50 + (item.branding.length * 35); // Увеличиваем базовый отступ до брендирования
    }

    return height;
}

/**
 * Create a canvas element for a cart item
 * @param {Object} item - Cart item data
 * @param {number} index - Item index
 * @param {HTMLElement} container - Container element for canvas
 * @returns {HTMLCanvasElement} Canvas element
 */
export function createCartItemCanvas(item, index, container) {
    // Проверяем, существует ли уже canvas для этого элемента
    const existingCanvas = container.querySelector(`.cart-item-canvas[data-item-id="${item.id}"]`);
    if (existingCanvas) {
        return existingCanvas;
    }

    // Calculate canvas dimensions based on container
    const canvas = document.createElement('canvas');
    canvas.className = 'cart-item-canvas';
    canvas.dataset.itemId = item.id;
    canvas.dataset.index = index;
    canvas.dataset.goodsId = item.goodsId;

    // Устанавливаем ширину на 100% от контейнера для правильного отображения
    canvas.style.width = '100%';
    canvas.style.boxSizing = 'border-box';
    canvas.style.display = 'block';

    // Возвращаем созданный, но не отрисованный canvas
    return canvas;
}

/**
 * Initialize canvas with correct dimensions and rendering
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 * @param {HTMLElement} container - Container element
 */
// function initializeCanvas(canvas, item, container) {
//     // Set size based on container width
//     const width = calculateCanvasWidth(container);
//     const height = calculateCanvasHeight(item);
//
//     // Set canvas size with device pixel ratio for crisp rendering
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = width * dpr;
//     canvas.height = height * dpr;
//
//     // Store original dimensions for resize handling
//     canvas.dataset.originalWidth = width;
//     canvas.dataset.originalHeight = height;
//
//     // Render the canvas
//     renderCartItem(canvas, item);
// }

/**
 * Handle window resize to adjust canvas
 * @returns {Array} List of resized canvases
 */
function handleCanvasResize() {
    const canvases = document.querySelectorAll('.cart-item-canvas');
    const resizedCanvases = [];

    canvases.forEach(canvas => {
        const container = canvas.closest('.cart-item');
        if (!container) return;

        const newWidth = calculateCanvasWidth(container);
        const dpr = window.devicePixelRatio || 1;

        // Только меняем внутреннее разрешение канваса
        if (Math.abs(newWidth * dpr - canvas.width) > 10) {
            const itemId = canvas.dataset.itemId;
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            const item = cartItems.find(i => i.id === itemId);

            if (item) {
                const height = calculateCanvasHeight(item);

                // Обновляем размеры канваса с учетом плотности пикселей
                canvas.width = newWidth * dpr;
                canvas.height = height * dpr;

                // Перерисовываем содержимое
                renderCartItem(canvas, item);

                // Добавляем в список обработанных канвасов
                resizedCanvases.push(canvas);
            }
        }
    });

    return resizedCanvases;
}

/**
 * Функция для рисования текста
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to render
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Object} options - Дополнительные опции (align, baseline)
 */
function drawTextWithFont(ctx, text, x, y, options = {}) {
    // Сохраняем состояние контекста
    ctx.save();

    // Задаем параметры текста
    const align = options.align || 'left';
    const baseline = options.baseline || 'middle';
    const fontSize = options.fontSize || CONFIG.textFontSize;

    // Устанавливаем шрифт
    ctx.font = `400 ${fontSize}px ${getCurrentFont()}`;
    ctx.fillStyle = options.color || CONFIG.textColor;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    // Рисуем текст
    ctx.fillText(text, x, y);

    // Восстанавливаем контекст
    ctx.restore();
}

/**
 * Draw branding items for cart item
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width of area
 * @returns {number} Updated Y position
 */
function drawBrandingItems(ctx, canvas, item, x, y, width) {
    if (!item.branding || item.branding.length === 0) {
        return y;
    }

    // Начинаем с отрисовки линии-разделителя
    ctx.strokeStyle = CONFIG.borderColor;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(x, y - 20); // Чуть выше текущей позиции
    ctx.lineTo(x + width, y - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Инициализируем объект для хранения позиций кнопок
    const brandingBtns = {};

    // Отрисовываем каждый элемент брендирования
    item.branding.forEach((brandingItem, index) => {
        // Формируем строку с типом, местом и цветами через несжимаемый пробел
        const colorsText = brandingItem.colors === 1
            ? '1 цвет'
            : (brandingItem.colors > 1 && brandingItem.colors < 5
                ? `${brandingItem.colors} цвета`
                : `${brandingItem.colors} цветов`);

        // Добавляем информацию о втором проходе
        let secondPassText = '';
        if (brandingItem.secondPass) {
            secondPassText = ', второй проход';
        }

        const typeLocColorsText = `${brandingItem.type} ${brandingItem.location}\u00A0${colorsText}${secondPassText}`;

        // Колонка 1: Тип, место, цвета и второй проход - с обычным шрифтом
        drawTextWithFont(ctx, typeLocColorsText, x, y, {
            baseline: 'middle',
            fontSize: 14
        });

        // Колонка 2: "Цена:" цена (через несжимаемый пробел) - с обычным шрифтом
        const secondPassMultiplier = brandingItem.secondPass ? 1.3 : 1;
        const currentPrice = brandingItem.price * brandingItem.colors * secondPassMultiplier;
        const priceText = `Цена:\u00A0${formatPrice(currentPrice)} руб.`;
        drawTextWithFont(ctx, priceText, x + Math.min(350, width * 0.5), y, {
            baseline: 'middle',
            fontSize: 14
        });

        // Колонка 3: "Сумма:" сумма (через несжимаемый пробел) - с обычным шрифтом
        const total = currentPrice * item.quantity;
        const sumText = `Сумма:\u00A0${formatPrice(total)} руб.`;
        drawTextWithFont(ctx, sumText, x + width - 40, y, {
            align: 'right',
            baseline: 'middle',
            fontSize: 14
        });

        // Колонка 4: Иконка удаления (без фона)
        const removeX = x + width - 20;

        // Рисуем иконку удаления (крестик)
        ctx.strokeStyle = CONFIG.textColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(removeX - 5, y - 5);
        ctx.lineTo(removeX + 5, y + 5);
        ctx.moveTo(removeX + 5, y - 5);
        ctx.lineTo(removeX - 5, y + 5);
        ctx.stroke();

        // Сохраняем позицию кнопки удаления для обработки кликов
        brandingBtns[`remove_${index}`] = {
            x: removeX - 10,
            y: y - 10,
            width: 20,
            height: 20,
            index: index
        };

        // Увеличиваем Y-координату для следующего элемента
        y += 35;
    });

    // Сохраняем информацию о кнопках в dataset канваса
    canvas.dataset.brandingBtns = JSON.stringify(brandingBtns);

    // Если есть брендирование, отрисовываем итоговую сумму
    if (item.branding.length > 0) {
        // Отрисовка линии-разделителя
        ctx.strokeStyle = CONFIG.borderColor;
        ctx.beginPath();
        ctx.moveTo(x, y - 10); // Уменьшаем отступ до линии
        ctx.lineTo(x + width, y - 10);
        ctx.stroke();

        // Вычисляем общую стоимость брендирования
        const totalBrandingCost = item.branding.reduce((sum, branding) => {
            const secondPassMultiplier = branding.secondPass ? 1.3 : 1;
            const currentPrice = branding.price * branding.colors * secondPassMultiplier;
            return sum + (currentPrice * item.quantity);
        }, 0);

        // Отрисовка строки с общей стоимостью брендирования
        y += 10; // Уменьшаем отступ после линии

        drawTextWithFont(ctx, 'Общая стоимость брендирования:', x, y, {
            baseline: 'middle',
            fontSize: 14
        });
        drawTextWithFont(ctx, `${formatPrice(totalBrandingCost)} руб.`, x + width - 20, y, {
            align: 'right',
            baseline: 'middle',
            fontSize: 14
        });

        y += 15; // Уменьшаем отступ после итоговой суммы
    }

    return y; // Возвращаем обновленную Y-координату
}

/**
 * Render cart item to canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 */
export async function renderCartItem(canvas, item) {
    // Ensure font is loaded before rendering
    await ensureFontLoaded();

    // Проверяем, находится ли canvas в режиме редактирования количества
    const isEditing = canvas.dataset.isEditing === 'true';

    // Проверяем, нужно ли обновить размеры canvas на основе содержимого
    const currentHeight = parseInt(canvas.dataset.originalHeight || 0);
    const neededHeight = calculateCanvasHeight(item);

    // Обновляем размеры канваса, если требуется
    if (currentHeight !== neededHeight) {
        const dpr = window.devicePixelRatio || 1;
        const currentWidth = parseInt(canvas.dataset.originalWidth || canvas.width / dpr);

        canvas.dataset.originalHeight = neededHeight;
        canvas.height = neededHeight * dpr;
    }

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Сбрасываем трансформации
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Очищаем весь канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применяем масштабирование для поддержки HiDPI дисплеев
    ctx.scale(dpr, dpr);

    // Используем реальные размеры отображения для работы
    const displayWidth = canvas.width / dpr;
    const displayHeight = canvas.height / dpr;

    // Draw card background with border
    ctx.fillStyle = CONFIG.backgroundColor;
    ctx.strokeStyle = CONFIG.borderColor;
    ctx.lineWidth = 1;

    // Draw rounded rectangle
    drawRoundedRect(ctx, 1, 1, displayWidth - 2, displayHeight - 2, CONFIG.borderRadius);
    ctx.fill();
    ctx.stroke();

    // Определяем базовые координаты
    const imageX = CONFIG.padding;
    const imageY = CONFIG.padding;
    const imageSize = CONFIG.imageSize;

    // Draw image placeholder with white background
    ctx.fillStyle = CONFIG.imageBackground;
    ctx.strokeStyle = CONFIG.borderColor;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, imageX, imageY, imageSize, imageSize, 6);
    ctx.fill();
    ctx.stroke();

    // Add placeholder icon
    ctx.fillStyle = CONFIG.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `400 30px ${getCurrentFont()}`;
    ctx.fillText('📷', imageX + imageSize / 2, imageY + imageSize / 2);

    // Load and draw actual image if available
    if (item.image) {
        const img = new Image();
        img.onload = function () {
            // Draw image in center of placeholder
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (aspectRatio > 1) {
                // Image is wider than tall
                drawWidth = imageSize;
                drawHeight = imageSize / aspectRatio;
                offsetX = 0;
                offsetY = (imageSize - drawHeight) / 2;
            } else {
                // Image is taller than wide
                drawWidth = imageSize * aspectRatio;
                drawHeight = imageSize;
                offsetX = (imageSize - drawWidth) / 2;
                offsetY = 0;
            }

            // Clear placeholder area
            ctx.clearRect(imageX, imageY, imageSize, imageSize);

            // Draw rounded rectangle with white background
            ctx.fillStyle = CONFIG.imageBackground;
            drawRoundedRect(ctx, imageX, imageY, imageSize, imageSize, 6);
            ctx.fill();

            // Draw rounded rectangle clipping mask
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(imageX, imageY, imageSize, imageSize, 6);
            ctx.clip();

            // Draw image
            ctx.drawImage(img, imageX + offsetX, imageY + offsetY, drawWidth, drawHeight);
            ctx.restore();

            // Redraw border for image area
            ctx.strokeStyle = CONFIG.borderColor;
            ctx.lineWidth = 1;
            drawRoundedRect(ctx, imageX, imageY, imageSize, imageSize, 6);
            ctx.stroke();
        };
        img.src = item.image;
    }

    // Определяем макет на основе ширины экрана
    const isMobileLayout = displayWidth < 550;

    // Область справа от изображения
    const contentX = imageX + imageSize + CONFIG.padding;
    const contentWidth = displayWidth - contentX - CONFIG.padding;

    // Название товара - используем цвет заголовка и больший размер
    ctx.fillStyle = CONFIG.headerColor;
    ctx.font = `600 ${CONFIG.headerFontSize}px ${getCurrentFont()}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const nameX = contentX;
    const nameY = imageY;

    // Ограничиваем длину названия
    const nameMaxWidth = contentWidth - 100;
    const name = truncateText(ctx, item.name, nameMaxWidth);
    ctx.fillText(name, nameX, nameY);

    // Артикул
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `400 ${CONFIG.textFontSize}px ${getCurrentFont()}`;
    const articleX = nameX;
    const articleY = nameY + (isMobileLayout ? 24 : 28);
    ctx.fillText(`Артикул: ${item.article}`, articleX, articleY);

    // Описание товара
    if (item.description) {
        ctx.fillStyle = CONFIG.textColor;
        ctx.font = `400 ${CONFIG.textFontSize}px ${getCurrentFont()}`;
        const descMaxWidth = contentWidth;

        const descriptionY = articleY + CONFIG.textFontSize + 4;

        // Выводим многострочное описание
        renderMultilineText(ctx, item.description, articleX, descriptionY, descMaxWidth, 2);
    }

    // Формируем строку с ценой, количеством и суммой под изображением
    const priceRowY = imageY + imageSize + CONFIG.padding + 8;

    // Равномерно распределяем элементы в строке
    const rowWidth = displayWidth - 2 * CONFIG.padding;

    // Инициализируем цену со скидкой, если её ещё нет
    if (item.discountPrice === undefined) {
        item.discountPrice = item.price;
    }

    // Разделяем строку на четыре части: цена, цена со скидкой, селектор количества, сумма
    const priceColumnWidth = rowWidth * 0.25;
    const discountPriceColumnWidth = rowWidth * 0.25;
    const qtyColumnWidth = rowWidth * 0.25;
    const totalColumnWidth = rowWidth * 0.25;

    // Цена (левая часть)
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `400 ${CONFIG.priceFontSize}px ${getCurrentFont()}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Цена: ${formatPrice(item.price)} руб.`, CONFIG.padding, priceRowY);

    // Цена со скидкой (после обычной цены)
    ctx.fillStyle = item.discountPrice < item.price ? '#d40000' : CONFIG.textColor;
    ctx.textAlign = 'left';
    ctx.fillText(`Цена со скидкой: ${formatPrice(item.discountPrice)} руб.`, CONFIG.padding + priceColumnWidth - 60, priceRowY);

    // Блок управления количеством (средняя часть)
    const wasEditing = canvas.dataset.isEditing === 'true';

    drawQuantityControls(ctx, canvas, item, CONFIG.padding + priceColumnWidth + discountPriceColumnWidth, priceRowY - 15, qtyColumnWidth);

    // Восстанавливаем флаг режима редактирования, если он был активен
    if (wasEditing) {
        canvas.dataset.isEditing = 'true';
    }

    // Сумма (правая часть) - используем цену со скидкой
    const total = item.discountPrice * item.quantity;
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `400 ${CONFIG.priceFontSize}px ${getCurrentFont()}`;
    ctx.textAlign = 'right';
    ctx.fillText(`Сумма: ${formatPrice(total)} руб.`, displayWidth - CONFIG.padding, priceRowY);

    // Проверка доступности брендирования
    let isBrandingAvailable = true;

    try {
        // Импортируем функции асинхронно
        const {fetchPrintOpportunities} = await import('../branding/brandingOptionsManager.js');
        const {isAnyBrandingAvailable} = await import('../branding/brandingAdd.js');

        // Получаем данные о возможностях брендирования из кэша
        const opportunities = await fetchPrintOpportunities(item.goodsId);

        // Проверяем доступность брендирования
        const existingBranding = item.branding || [];
        isBrandingAvailable = isAnyBrandingAvailable(opportunities, existingBranding);
    } catch (error) {
        console.error('Error checking branding availability:', error);
        // В случае ошибки считаем брендирование доступным
        isBrandingAvailable = true;
    }

    // Кнопка "Добавить брендирование" - ниже строки с ценой
    const brandingY = priceRowY + 20;
    drawBrandingButton(ctx, canvas, item, CONFIG.padding, brandingY, displayWidth - 2 * CONFIG.padding, isBrandingAvailable);

    // Отрисовка элементов брендирования, если они есть
    let currentY = brandingY + 60;
    if (item.branding && item.branding.length > 0) {
        currentY = drawBrandingItems(ctx, canvas, item, CONFIG.padding, currentY, displayWidth - 2 * CONFIG.padding);
    }

    // Кнопка удаления - в правом верхнем углу
    drawRemoveButton(ctx, canvas, displayWidth - 40, CONFIG.padding);
}

/**
 * Draw quantity controls (plus, minus, input)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width of control area
 */
function drawQuantityControls(ctx, canvas, item, x, y, width) {
    // Сохраняем состояние контекста
    ctx.save();

    const qtyAreaHeight = 30;
    // Увеличиваем ширину блока для шестизначных чисел
    const qtyAreaWidth = Math.min(width, 180); // Увеличено с 150 до 180 для 6 цифр
    // Смещаем блок левее на 20 пикселей
    const qtyAreaX = x + (width - qtyAreaWidth) / 2 - 20;
    const qtyAreaY = y;

    // Фон для всего блока
    ctx.fillStyle = CONFIG.buttonBackground;
    drawRoundedRect(ctx, qtyAreaX, qtyAreaY, qtyAreaWidth, qtyAreaHeight, 6);
    ctx.fill();

    // Размеры кнопок и поля ввода - делаем центральную часть больше
    const buttonWidth = qtyAreaWidth / 5; // Уменьшаем ширину кнопок с 1/4 до 1/5
    const inputWidth = qtyAreaWidth - (buttonWidth * 2); // Увеличиваем центральную часть

    // Minus button
    ctx.strokeStyle = CONFIG.textColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = CONFIG.buttonBackground;
    drawRoundedRect(ctx, qtyAreaX, qtyAreaY, buttonWidth, qtyAreaHeight, [4, 0, 0, 4]);
    ctx.fill();

    // Draw minus symbol
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `400 ${CONFIG.textFontSize}px ${getCurrentFont()}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('-', qtyAreaX + buttonWidth / 2, qtyAreaY + qtyAreaHeight / 2);

    // Quantity input area - белый фон с увеличенной шириной
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qtyAreaX + buttonWidth, qtyAreaY, inputWidth, qtyAreaHeight);

    // Draw quantity text
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `400 ${CONFIG.textFontSize}px ${getCurrentFont()}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.quantity.toString(), qtyAreaX + buttonWidth + inputWidth / 2, qtyAreaY + qtyAreaHeight / 2);

    // Plus button
    ctx.fillStyle = CONFIG.buttonBackground;
    drawRoundedRect(ctx, qtyAreaX + buttonWidth + inputWidth, qtyAreaY, buttonWidth, qtyAreaHeight, [0, 4, 4, 0]);
    ctx.fill();

    // Draw plus symbol
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `400 ${CONFIG.textFontSize}px ${getCurrentFont()}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', qtyAreaX + buttonWidth + inputWidth + buttonWidth / 2, qtyAreaY + qtyAreaHeight / 2);

    // Store button positions in canvas dataset with center points
    const minusBtnPos = {
        x: qtyAreaX,
        y: qtyAreaY,
        width: buttonWidth,
        height: qtyAreaHeight,
        centerX: qtyAreaX + buttonWidth / 2,
        centerY: qtyAreaY + qtyAreaHeight / 2
    };

    const plusBtnPos = {
        x: qtyAreaX + buttonWidth + inputWidth,
        y: qtyAreaY,
        width: buttonWidth,
        height: qtyAreaHeight,
        centerX: qtyAreaX + buttonWidth + inputWidth + buttonWidth / 2,
        centerY: qtyAreaY + qtyAreaHeight / 2
    };

    // Store quantity input field position and dimensions with center point
    const qtyInputPos = {
        x: qtyAreaX + buttonWidth,
        y: qtyAreaY,
        width: inputWidth,
        height: qtyAreaHeight,
        centerX: qtyAreaX + buttonWidth + inputWidth / 2,
        centerY: qtyAreaY + qtyAreaHeight / 2
    };

    canvas.dataset.minusBtn = JSON.stringify(minusBtnPos);
    canvas.dataset.plusBtn = JSON.stringify(plusBtnPos);
    canvas.dataset.qtyInput = JSON.stringify(qtyInputPos);

    // Восстанавливаем состояние контекста
    ctx.restore();
}

/**
 * Draw remove button
 */
function drawRemoveButton(ctx, canvas, x, y) {
    const removeSize = 30;

    // Квадрат со скругленными углами (4px)
    ctx.fillStyle = '#F2FFFF'; // Фон как указано
    drawRoundedRect(ctx, x, y, removeSize, removeSize, 4); // Радиус скругления 4px
    ctx.fill();

    // Рисуем иконку мусорной корзины (простая стилизация)
    ctx.fillStyle = '#0F4880'; // Цвет иконки
    ctx.strokeStyle = '#0F4880';
    ctx.lineWidth = 1.5;

    // Верхняя часть корзины (крышка)
    ctx.beginPath();
    ctx.moveTo(x + removeSize * 0.25, y + removeSize * 0.3);
    ctx.lineTo(x + removeSize * 0.75, y + removeSize * 0.3);
    ctx.stroke();

    // Ручка крышки
    ctx.beginPath();
    ctx.moveTo(x + removeSize * 0.4, y + removeSize * 0.3);
    ctx.lineTo(x + removeSize * 0.4, y + removeSize * 0.25);
    ctx.lineTo(x + removeSize * 0.6, y + removeSize * 0.25);
    ctx.lineTo(x + removeSize * 0.6, y + removeSize * 0.3);
    ctx.stroke();

    // Корпус корзины
    ctx.beginPath();
    ctx.moveTo(x + removeSize * 0.3, y + removeSize * 0.3);
    ctx.lineTo(x + removeSize * 0.35, y + removeSize * 0.75);
    ctx.lineTo(x + removeSize * 0.65, y + removeSize * 0.75);
    ctx.lineTo(x + removeSize * 0.7, y + removeSize * 0.3);
    ctx.stroke();

    // Линии внутри корзины
    ctx.beginPath();
    ctx.moveTo(x + removeSize * 0.4, y + removeSize * 0.35);
    ctx.lineTo(x + removeSize * 0.4, y + removeSize * 0.7);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + removeSize * 0.5, y + removeSize * 0.35);
    ctx.lineTo(x + removeSize * 0.5, y + removeSize * 0.7);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + removeSize * 0.6, y + removeSize * 0.35);
    ctx.lineTo(x + removeSize * 0.6, y + removeSize * 0.7);
    ctx.stroke();

    // Store button position with center point
    const removeBtnPos = {
        x: x,
        y: y,
        width: removeSize,
        height: removeSize,
        centerX: x + removeSize / 2,
        centerY: y + removeSize / 2
    };

    canvas.dataset.removeBtn = JSON.stringify(removeBtnPos);
}

/**
 * Draw branding button
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width of button
 * @param {boolean} isAvailable - Whether branding is available
 */
function drawBrandingButton(ctx, canvas, item, x, y, width, isAvailable = true) {
    // Высота кнопки
    const height = 40;

    // Dashed border
    ctx.strokeStyle = isAvailable ? '#ddd' : '#ccc';
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1;

    // Background color
    ctx.fillStyle = isAvailable ? CONFIG.buttonBackground : '#f5f5f5';

    // Draw button
    drawRoundedRect(ctx, x, y, width, height, 6);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Text
    ctx.fillStyle = isAvailable ? CONFIG.textColor : '#888';

    // Используем обычный вес шрифта
    ctx.font = isAvailable
        ? `400 14px ${getCurrentFont()}`
        : `400 12px ${getCurrentFont()}`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Разный текст в зависимости от доступности
    const buttonText = isAvailable
        ? 'Добавить брендирование'
        : 'Для данного товара исчерпаны опции брендирования';

    // Если текст длинный, разбиваем его на две строки
    if (!isAvailable && width < 400) {
        // Разбиваем длинный текст на две строки
        const words = buttonText.split(' ');
        const midPoint = Math.floor(words.length / 2);
        const line1 = words.slice(0, midPoint).join(' ');
        const line2 = words.slice(midPoint).join(' ');

        ctx.fillText(line1, x + width / 2, y + height / 2 - 8);
        ctx.fillText(line2, x + width / 2, y + height / 2 + 8);
    } else {
        // Обычный одностроковый текст
        ctx.fillText(buttonText, x + width / 2, y + height / 2);
    }

    // Store branding button position with center point
    const brandingBtnPos = {
        x: x,
        y: y,
        width: width,
        height: height,
        centerX: x + width / 2,
        centerY: y + height / 2,
        isAvailable: isAvailable // Сохраняем состояние доступности
    };

    canvas.dataset.brandingBtn = JSON.stringify(brandingBtnPos);
}

/**
 * Truncate text to fit within maxWidth
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum width in pixels
 * @returns {string} Truncated text
 */
function truncateText(ctx, text, maxWidth) {
    if (!text) return '';

    // Сохраняем текущее состояние контекста
    const currentFont = ctx.font;

    const ellipsis = '...';
    const ellipsisWidth = ctx.measureText(ellipsis).width;

    let textWidth = ctx.measureText(text).width;
    if (textWidth <= maxWidth) {
        return text;
    }

    // Truncate the text
    let truncated = text;
    while (truncated.length > 0 && ctx.measureText(truncated + ellipsis).width > maxWidth) {
        truncated = truncated.slice(0, -1);
    }

    return truncated + ellipsis;
}

/**
 * Render multiline text with word wrapping
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to render
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} maxWidth - Maximum width per line
 * @param {number} maxLines - Maximum number of lines
 */
function renderMultilineText(ctx, text, x, y, maxWidth, maxLines) {
    if (!text) return;

    // Сохраняем текущее состояние контекста
    ctx.save();

    // Устанавливаем шрифт с явным указанием веса 400
    ctx.font = `400 ${CONFIG.textFontSize}px ${getCurrentFont()}`;

    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const lineHeight = CONFIG.textFontSize * 1.2; // используем высоту линии на основе размера шрифта
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            lineCount++;

            if (lineCount >= maxLines) {
                ctx.fillText('...', x + ctx.measureText(line).width + 4, currentY);
                break;
            }

            line = words[i] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }

    if (lineCount < maxLines) {
        ctx.fillText(line, x, currentY);
    }

    // Восстанавливаем состояние контекста
    ctx.restore();
}

/**
 * Draw rounded rectangle
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {number} radius - Border radius
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.closePath();
}

/**
 * Initialize cart item canvases
 * @param {HTMLElement} container - Container for cart items
 */
export function initCartItemCanvases(container) {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    // Get empty cart message and summary elements
    const emptyCart = document.querySelector('.cart-empty');
    const summary = document.querySelector('.cart-summary');

    if (cartItems.length === 0) {
        // Show empty cart message and hide summary
        if (emptyCart) {
            emptyCart.classList.remove('item-hidden');
        }

        if (summary) {
            summary.classList.add('item-hidden');
        }

        // Clear container if there are no items
        container.innerHTML = '';
        return;
    }

    // Hide empty cart message and show summary
    if (emptyCart) {
        emptyCart.classList.add('item-hidden');
    }

    if (summary) {
        summary.classList.remove('item-hidden');
    }

    // Получаем текущие элементы корзины в контейнере
    const existingItems = Array.from(container.querySelectorAll('.cart-item'));
    const existingCanvases = {};

    // Создаем карту существующих канвасов по ID товара
    existingItems.forEach(itemContainer => {
        const canvas = itemContainer.querySelector('.cart-item-canvas');
        if (canvas && canvas.dataset.itemId) {
            existingCanvases[canvas.dataset.itemId] = {
                container: itemContainer,
                canvas: canvas
            };
        }
    });

    // Список элементов, которые нужно удалить (исчезнувшие из корзины)
    const itemIdsToRemove = Object.keys(existingCanvases).filter(
        id => !cartItems.some(item => item.id === id)
    );

    // Удаляем элементы, которых больше нет в корзине
    itemIdsToRemove.forEach(itemId => {
        if (existingCanvases[itemId] && existingCanvases[itemId].container) {
            existingCanvases[itemId].container.remove();
            delete existingCanvases[itemId];
        }
    });

    // Массив для хранения всех канвасов
    const allCanvases = [];

    // Обрабатываем все товары в корзине
    cartItems.forEach((item, index) => {
        let itemContainer, canvas;

        // Проверяем, есть ли уже такой товар
        if (existingCanvases[item.id]) {
            // Используем существующий контейнер и канвас
            itemContainer = existingCanvases[item.id].container;
            canvas = existingCanvases[item.id].canvas;
            canvas.dataset.index = index; // Обновляем индекс

            // Обновляем содержимое канваса
            renderCartItem(canvas, item);
        } else {
            // Создаем новый контейнер и канвас
            itemContainer = document.createElement('div');
            itemContainer.className = 'cart-item';
            canvas = createCartItemCanvas(item, index, itemContainer);

            // Добавляем в DOM
            itemContainer.appendChild(canvas);
            container.appendChild(itemContainer);

            // Инициализируем канвас
            const width = calculateCanvasWidth(itemContainer);
            const height = calculateCanvasHeight(item);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.dataset.originalWidth = width;
            canvas.dataset.originalHeight = height;

            // Рисуем содержимое
            renderCartItem(canvas, item);
        }

        // Добавляем канвас в массив для дальнейшей обработки
        allCanvases.push(canvas);
    });

    // Возвращаем массив всех канвасов
    return allCanvases;
}

/**
 * Initialize cart rendering
 * Sets up canvas rendering for cart items and subscribes to cart update events
 */
export function initCartRendering() {
    const container = document.querySelector('.cart-page__items');
    if (container) {
        // Переменные для дебаунсинга и отслеживания событий
        let canvasReadyTimer = null;
        let lastReadyEventTime = 0;
        const READY_EVENT_DELAY = 100;
        let eventCounter = 0; // Counter to identify unique events

        // Функция для принудительного сброса и перерисовки канваса по ID товара
        async function resetAndRedrawCanvas(itemId) {
            const canvas = document.querySelector(`.cart-item-canvas[data-item-id="${itemId}"]`);
            if (canvas) {
                // Используем современный метод reset(), если он доступен
                const ctx = canvas.getContext('2d');

                // Сохраняем текущие размеры
                const width = canvas.width;
                const height = canvas.height;

                try {
                    // Пробуем использовать современный метод reset (поддерживается в большинстве современных браузеров)
                    if (ctx.reset && typeof ctx.reset === 'function') {
                        ctx.reset();
                        // console.log('Used ctx.reset() for canvas reset');
                    } else {
                        // Fallback: используем традиционный метод
                        canvas.width = width;
                        // console.log('Used width reset for canvas');
                    }
                } catch (e) {
                    // В случае ошибки с reset(), используем традиционный подход
                    // canvas.width = width;
                    console.log('Reset error, fallback to width reset', e.message);
                }

                // Перерисовываем канвас
                const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                const item = cartItems.find(i => i.id === itemId);
                if (item) {
                    await renderCartItem(canvas, item);
                    // console.log('Canvas state reset and redrawn', itemId);
                }
            }
        }

        // Функция для отправки события о готовности canvas с дебаунсингом
        function notifyCanvasReady(source = 'init', canvases = []) {
            clearTimeout(canvasReadyTimer);
            canvasReadyTimer = setTimeout(() => {
                const now = Date.now();
                // Предотвращаем отправку событий слишком часто
                if (now - lastReadyEventTime < 500) {
                    return;
                }

                eventCounter++;

                lastReadyEventTime = now;

                const eventData = {
                    timestamp: now,
                    canvasCount: canvases.length || document.querySelectorAll('.cart-item-canvas').length,
                    source: source,
                    id: eventCounter, // Include unique id for the event
                    canvases: canvases  // Pass the canvas elements directly
                };

                // Публикуем событие
                eventBus.publish('canvas:ready', eventData);
            }, READY_EVENT_DELAY);
        }

        // Load font first, then initialize canvases
        ensureFontLoaded().then(() => {
            // Create and render all canvases
            const canvases = initCartItemCanvases(container);

            // Отправляем событие о готовности canvas с указанием конкретных элементов
            notifyCanvasReady('initial-render', canvases);

            // Subscribe to cart updates to refresh canvases
            eventBus.subscribe(STORAGE_EVENTS.CART_UPDATED, () => {
                if (container) {
                    const updatedCanvases = initCartItemCanvases(container);

                    // Отправляем событие о готовности после обновления корзины,
                    // указывая только обновленные канвасы
                    notifyCanvasReady('cart-update', updatedCanvases);
                }
            });

            // Подписываемся на событие обновления цены, чтобы перерисовать canvas
            eventBus.subscribe(UPDATE_EVENTS.PRICE_CALCULATION_COMPLETE, (data) => {
                if (data && data.item) {
                    // Находим canvas для обновления
                    const canvas = document.querySelector(`.cart-item-canvas[data-item-id="${data.item.id}"]`);
                    if (canvas) {
                        // Перерисовываем canvas с обновленными данными товара
                        renderCartItem(canvas, data.item);

                        // Отправляем событие о готовности canvas
                        notifyCanvasReady('price-update', [canvas]);
                    }
                }
            });

            // Подписываемся на события связанные с брендированием
            eventBus.subscribe('cart:branding:add', (data) => {
                // Сбрасываем состояние канваса после того, как брендирование добавлено
                if (data && data.itemId) {
                    setTimeout(() => {
                        resetAndRedrawCanvas(data.itemId);
                    }, 300); // Используем большую задержку для завершения транзакции брендирования
                }
            });

            // Подписываемся на событие обновления брендирования для элемента корзины
            eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_UPDATED, (data) => {
                if (data && data.item && data.item.id) {
                    setTimeout(() => {
                        resetAndRedrawCanvas(data.item.id);
                    }, 100);
                }
            });

            // Add resize listener for responsive canvases
            window.addEventListener('resize', () => {
                // Вызываем с задержкой для нормализации частых изменений размера
                clearTimeout(window.canvasResizeTimer);
                window.canvasResizeTimer = setTimeout(() => {
                    const resizedCanvases = handleCanvasResize();

                    // Отправляем событие о готовности после ресайза
                    notifyCanvasReady('resize', resizedCanvases);
                }, 150);
            });

            // Инициализируем resizeObserver для отслеживания изменения размера контейнера
            if (typeof ResizeObserver !== 'undefined') {
                const resizeObserver = new ResizeObserver(() => {
                    // Обработка аналогична window resize
                    clearTimeout(window.containerResizeTimer);
                    window.containerResizeTimer = setTimeout(() => {
                        const resizedCanvases = handleCanvasResize();

                        // Отправляем событие о готовности после ресайза контейнера
                        notifyCanvasReady('container-resize', resizedCanvases);
                    }, 150);
                });

                // Наблюдаем за контейнером
                resizeObserver.observe(container);
            }

            // Добавляем обработчик движения мыши для изменения курсора
            initCanvasMouseHandlers(container);

            // Добавляем обработчик кликов для сброса состояния канваса после взаимодействия
            container.addEventListener('click', (e) => {
                const canvas = e.target.closest('canvas.cart-item-canvas');
                if (canvas) {
                    // Сохраняем ID товара
                    const itemId = canvas.dataset.itemId;

                    // После небольшой задержки (чтобы завершились другие обработчики)
                    setTimeout(() => {
                        // Используем общую функцию сброса и перерисовки
                        resetAndRedrawCanvas(itemId);
                    }, 50);
                }
            });
        });
    }
}

/**
 * Initialize mouse handlers for canvas elements to show pointer cursor on interactive elements
 * @param {HTMLElement} container - Container with cart item canvases
 */
function initCanvasMouseHandlers(container) {
    container.addEventListener('mousemove', (e) => {
        const canvas = e.target.closest('canvas.cart-item-canvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        // Учитываем масштабирование канваса
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Вычисляем координаты мыши внутри канваса 
        // с учетом devicePixelRatio
        const dpr = window.devicePixelRatio || 1;
        const x = (e.clientX - rect.left) * scaleX / dpr;
        const y = (e.clientY - rect.top) * scaleY / dpr;

        // Проверяем наведение на кнопки
        const isPointer = isPointInInteractiveArea(canvas, x, y);
        canvas.style.cursor = isPointer ? 'pointer' : 'default';
    });
}

/**
 * Check if point is inside any interactive area
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if point is in interactive area
 */
function isPointInInteractiveArea(canvas, x, y) {
    // Проверка кнопки удаления
    if (canvas.dataset.removeBtn) {
        const removeBtn = JSON.parse(canvas.dataset.removeBtn);
        if (isPointInRect(x, y, removeBtn.x, removeBtn.y, removeBtn.width, removeBtn.height)) {
            return true;
        }
    }

    // Проверка кнопок плюс/минус
    if (canvas.dataset.minusBtn) {
        const minusBtn = JSON.parse(canvas.dataset.minusBtn);
        if (isPointInRect(x, y, minusBtn.x, minusBtn.y, minusBtn.width, minusBtn.height)) {
            return true;
        }
    }

    if (canvas.dataset.plusBtn) {
        const plusBtn = JSON.parse(canvas.dataset.plusBtn);
        if (isPointInRect(x, y, plusBtn.x, plusBtn.y, plusBtn.width, plusBtn.height)) {
            return true;
        }
    }

    // Проверка кнопки брендирования (у нее не сохраняются координаты в dataset,
    // поэтому смотрим по Y-координате примерно где находится кнопка)
    const height = parseInt(canvas.dataset.originalHeight || canvas.height);
    const brandingBtnY = height * 0.6; // Примерно где находится кнопка брендирования

    if (y > brandingBtnY && y < brandingBtnY + 40) {
        return true;
    }

    return false;
}

/**
 * Check if point is inside rectangle
 * @param {number} x - Point X coordinate
 * @param {number} y - Point Y coordinate
 * @param {number} rectX - Rectangle X coordinate
 * @param {number} rectY - Rectangle Y coordinate
 * @param {number} rectWidth - Rectangle width
 * @param {number} rectHeight - Rectangle height
 * @returns {boolean} True if point is inside rectangle
 */
function isPointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
    return x >= rectX && x <= rectX + rectWidth &&
        y >= rectY && y <= rectY + rectHeight;
}
