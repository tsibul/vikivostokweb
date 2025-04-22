/**
 * Cart Item Renderer Module
 * Handles rendering cart items using Canvas
 */

import eventBus from '../eventBus.js';
import { formatPrice } from '../pricing/priceFormatter.js';
import { STORAGE_EVENTS } from '../cartStorage.js';
import { logCanvasReadyEvent } from './eventDebugger.js';

// Flag to track font loading status
let isFontLoaded = false;

// Configuration for canvas rendering
const CONFIG = {
    itemMinHeight: 220,
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
    textFontSize: 14,              // Размер обычного текста (артикул, описание)
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
                        console.warn('Failed to load Montserrat font, using fallback');
                        resolve();
                    });
                } catch (e) {
                    // FontFace API failed, use fallback
                    console.warn('FontFace API error, using fallback font');
                    resolve();
                }
            });
        } else {
            // FontFace API not available, use fallback immediately
            console.warn('FontFace API not available, using fallback font');
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
        // 40px base + 45px per branding item
        height += 40 + (item.branding.length * 45);
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
        console.log(`Using existing canvas for item ${item.id}`);
        return existingCanvas;
    }
    
    // Calculate canvas dimensions based on container
    const canvas = document.createElement('canvas');
    canvas.className = 'cart-item-canvas';
    canvas.dataset.itemId = item.id;
    canvas.dataset.index = index;
    
    console.log(`Creating canvas for item ${item.id}`);
    
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
function initializeCanvas(canvas, item, container) {
    // Set size based on container width
    const width = calculateCanvasWidth(container);
    const height = calculateCanvasHeight(item);
    
    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Store original dimensions for resize handling
    canvas.dataset.originalWidth = width;
    canvas.dataset.originalHeight = height;
    
    // Render the canvas
    renderCartItem(canvas, item);
}

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
                
                // Обновляем размер канваса с учетом плотности пикселей
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
 * Render cart item to canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} item - Cart item data
 */
export async function renderCartItem(canvas, item) {
    // Ensure font is loaded before rendering
    await ensureFontLoaded();
    
    // Проверяем, находится ли canvas в режиме редактирования количества
    const isEditing = canvas.dataset.isEditing === 'true';
    
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
    drawRoundedRect(ctx, 1, 1, displayWidth-2, displayHeight-2, CONFIG.borderRadius);
    ctx.fill();
    ctx.stroke();
    
    // Определяем базовую высоту для элементов
    const baseHeight = displayHeight - 2;
    
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
    ctx.font = `30px ${getCurrentFont()}`;
    ctx.fillText('📷', imageX + imageSize/2, imageY + imageSize/2);
    
    // Load and draw actual image if available
    if (item.image) {
        const img = new Image();
        img.onload = function() {
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
    
    // Название товара - используем цвет заголовка и размер для заголовка
    ctx.fillStyle = CONFIG.headerColor;
    ctx.font = `bold ${CONFIG.headerFontSize}px ${getCurrentFont()}`; // 16px для заголовка
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const nameX = contentX;
    const nameY = imageY;
    
    // Ограничиваем длину названия
    const nameMaxWidth = contentWidth - 100;
    const name = truncateText(ctx, item.name, nameMaxWidth);
    ctx.fillText(name, nameX, nameY);
    
    // Артикул - 14px
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.textFontSize}px ${getCurrentFont()}`; // 14px для артикула
    const articleX = nameX;
    const articleY = nameY + (isMobileLayout ? 24 : 28);
    ctx.fillText(`Артикул: ${item.article}`, articleX, articleY);
    
    // Описание товара сразу после артикула (без отступа) - 14px
    // Выравниваем по нижнему краю картинки
    if (item.description) {
        ctx.fillStyle = CONFIG.textColor;
        ctx.font = `${CONFIG.textFontSize}px ${getCurrentFont()}`; // 14px для описания
        const descMaxWidth = contentWidth;
        
        // Если есть описание, размещаем его сразу под артикулом
        const descriptionY = articleY + CONFIG.textFontSize + 4; // Минимальный отступ только для читаемости
        
        // Выводим многострочное описание
        renderMultilineText(ctx, item.description, articleX, descriptionY, descMaxWidth, 2);
    }
    
    // Формируем строку с ценой, количеством и суммой под изображением
    const priceRowY = imageY + imageSize + CONFIG.padding + 8;
    
    // Равномерно распределяем элементы в строке
    const rowWidth = displayWidth - 2 * CONFIG.padding;
    
    // Разделяем строку на три части: цена, селектор количества, сумма
    const priceColumnWidth = rowWidth * 0.35;
    const qtyColumnWidth = rowWidth * 0.30;
    const totalColumnWidth = rowWidth * 0.35;
    
    // Цена (левая часть) - 15px
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.priceFontSize}px ${getCurrentFont()}`; // 15px для цен
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Цена: ${formatPrice(item.price)} руб/шт.`, CONFIG.padding, priceRowY);
    
    // Блок управления количеством (средняя часть)
    // Сохраняем флаг редактирования, чтобы не потерять его при перерисовке
    const wasEditing = canvas.dataset.isEditing === 'true';
    
    drawQuantityControls(ctx, canvas, item, CONFIG.padding + priceColumnWidth, priceRowY - 15, qtyColumnWidth);
    
    // Восстанавливаем флаг режима редактирования, если он был активен
    if (wasEditing) {
        canvas.dataset.isEditing = 'true';
    }
    
    // Сумма (правая часть) - 15px, без выделения жирным
    const total = item.price * item.quantity;
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.priceFontSize}px ${getCurrentFont()}`; // 15px для цен
    ctx.textAlign = 'right';
    ctx.fillText(`Сумма: ${formatPrice(total)} руб.`, displayWidth - CONFIG.padding, priceRowY);
    
    // Кнопка "Добавить брендирование" - ниже строки с ценой
    const brandingY = priceRowY + 20;
    drawBrandingButton(ctx, canvas, item, CONFIG.padding, brandingY, displayWidth - 2 * CONFIG.padding);
    
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
    ctx.font = `${CONFIG.textFontSize}px ${getCurrentFont()}`; // используем стандартный размер текста
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('-', qtyAreaX + buttonWidth/2, qtyAreaY + qtyAreaHeight/2);
    
    // Quantity input area - белый фон с увеличенной шириной
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qtyAreaX + buttonWidth, qtyAreaY, inputWidth, qtyAreaHeight);
    
    // Draw quantity text
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.textFontSize}px ${getCurrentFont()}`; // используем стандартный размер текста
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.quantity.toString(), qtyAreaX + buttonWidth + inputWidth/2, qtyAreaY + qtyAreaHeight/2);
    
    // Plus button
    ctx.fillStyle = CONFIG.buttonBackground;
    drawRoundedRect(ctx, qtyAreaX + buttonWidth + inputWidth, qtyAreaY, buttonWidth, qtyAreaHeight, [0, 4, 4, 0]);
    ctx.fill();
    
    // Draw plus symbol
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.textFontSize}px ${getCurrentFont()}`; // используем стандартный размер текста
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', qtyAreaX + buttonWidth + inputWidth + buttonWidth/2, qtyAreaY + qtyAreaHeight/2);
    
    // Store button positions in canvas dataset with center points
    const minusBtnPos = {
        x: qtyAreaX, 
        y: qtyAreaY, 
        width: buttonWidth, 
        height: qtyAreaHeight,
        centerX: qtyAreaX + buttonWidth/2,
        centerY: qtyAreaY + qtyAreaHeight/2
    };
    
    const plusBtnPos = {
        x: qtyAreaX + buttonWidth + inputWidth, 
        y: qtyAreaY, 
        width: buttonWidth, 
        height: qtyAreaHeight,
        centerX: qtyAreaX + buttonWidth + inputWidth + buttonWidth/2,
        centerY: qtyAreaY + qtyAreaHeight/2
    };
    
    // Store quantity input field position and dimensions with center point
    const qtyInputPos = {
        x: qtyAreaX + buttonWidth, 
        y: qtyAreaY, 
        width: inputWidth, 
        height: qtyAreaHeight,
        centerX: qtyAreaX + buttonWidth + inputWidth/2,
        centerY: qtyAreaY + qtyAreaHeight/2
    };
    
    canvas.dataset.minusBtn = JSON.stringify(minusBtnPos);
    canvas.dataset.plusBtn = JSON.stringify(plusBtnPos);
    canvas.dataset.qtyInput = JSON.stringify(qtyInputPos);
    
    console.log(`Canvas ID: ${canvas.dataset.itemId}, Controls:`, {
        minus: minusBtnPos,
        input: qtyInputPos,
        plus: plusBtnPos
    });
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
        centerX: x + removeSize/2,
        centerY: y + removeSize/2
    };
    
    canvas.dataset.removeBtn = JSON.stringify(removeBtnPos);
    
    console.log(`Canvas ID: ${canvas.dataset.itemId}, Remove button:`, removeBtnPos);
}

/**
 * Draw branding button
 */
function drawBrandingButton(ctx, canvas, item, x, y, width) {
    // Высота кнопки
    const height = 40;
    
    // Dashed border
    ctx.strokeStyle = '#ddd';
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1;
    
    // Background color
    ctx.fillStyle = CONFIG.buttonBackground;
    
    // Draw button
    drawRoundedRect(ctx, x, y, width, height, 6);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Text
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `14px ${getCurrentFont()}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Добавить брендирование', x + width/2, y + height/2);
    
    // Store branding button position with center point
    const brandingBtnPos = {
        x: x, 
        y: y, 
        width: width, 
        height: height,
        centerX: x + width/2,
        centerY: y + height/2
    };
    
    canvas.dataset.brandingBtn = JSON.stringify(brandingBtnPos);
    
    console.log(`Canvas ID: ${item.id}, Branding button:`, brandingBtnPos);
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
        console.log('Starting cart rendering initialization');
        
        // Переменные для дебаунсинга и отслеживания событий
        let canvasReadyTimer = null;
        let lastReadyEventTime = 0;
        const READY_EVENT_DELAY = 100;
        let eventCounter = 0; // Counter to identify unique events
        
        // Функция для отправки события о готовности canvas с дебаунсингом
        function notifyCanvasReady(source = 'init', canvases = []) {
            clearTimeout(canvasReadyTimer);
            canvasReadyTimer = setTimeout(() => {
                const now = Date.now();
                // Предотвращаем отправку событий слишком часто
                if (now - lastReadyEventTime < 500) {
                    console.log('Skipping canvas:ready event due to throttling');
                    return;
                }
                
                eventCounter++;
                
                console.log(`Canvases fully rendered, firing canvas:ready event (source: ${source}, id: ${eventCounter})`);
                lastReadyEventTime = now;
                
                const eventData = {
                    timestamp: now,
                    canvasCount: canvases.length || document.querySelectorAll('.cart-item-canvas').length,
                    source: source,
                    id: eventCounter, // Include unique id for the event
                    canvases: canvases  // Pass the canvas elements directly
                };
                
                // Логируем отправку события
                logCanvasReadyEvent(eventData, true);
                
                // Публикуем событие
                eventBus.publish('canvas:ready', eventData);
            }, READY_EVENT_DELAY);
        }
        
        // Load font first, then initialize canvases
        ensureFontLoaded().then(() => {
            console.log('Font loaded, initializing canvases');
            
            // Create and render all canvases
            const canvases = initCartItemCanvases(container);
            
            // Отправляем событие о готовности canvas с указанием конкретных элементов
            notifyCanvasReady('initial-render', canvases);
            
            // Subscribe to cart updates to refresh canvases
            eventBus.subscribe(STORAGE_EVENTS.CART_UPDATED, () => {
                if (container) {
                    console.log('Cart updated, re-initializing canvases');
                    const updatedCanvases = initCartItemCanvases(container);
                    
                    // Отправляем событие о готовности после обновления корзины,
                    // указывая только обновленные канвасы
                    notifyCanvasReady('cart-update', updatedCanvases);
                }
            });
            
            // Add resize listener for responsive canvases
            window.addEventListener('resize', () => {
                // Вызываем с задержкой для нормализации частых изменений размера
                clearTimeout(window.canvasResizeTimer);
                window.canvasResizeTimer = setTimeout(() => {
                    console.log('Window resized, adjusting canvases');
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
                        console.log('Container resized, adjusting canvases');
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
