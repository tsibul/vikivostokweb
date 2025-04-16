'use strict';

/**
 * Модуль для управления модальными окнами и уведомлениями корзины
 */
export const CartAlert = {
    /**
     * Показывает модальное окно добавления товара в корзину
     * @param {Object} product - объект товара с информацией
     * @param {Function} onConfirm - callback при подтверждении 
     */
    showAddToCartModal: function(product, onConfirm) {
        // Проверяем, существует ли уже модальное окно
        let modal = document.getElementById('addToCartModal');
        
        // Если нет, создаем новое
        if (!modal) {
            modal = this._createModal();
            document.body.appendChild(modal);
            this._setupModalEvents(modal);
        }
        
        // Заполняем данные товара
        const productNameEl = document.getElementById('modalProductName');
        const articleEl = document.getElementById('modalArticle');
        const colorEl = document.getElementById('modalColor');
        
        if (productNameEl) productNameEl.textContent = product.name || '';
        if (articleEl) articleEl.textContent = product.article || '';
        if (colorEl) colorEl.textContent = product.color || '';
        
        // Открываем модальное окно
        modal.classList.add('active');
        
        // Устанавливаем callback для кнопки подтверждения
        const confirmBtn = document.getElementById('modalConfirmBtn');
        if (confirmBtn) {
            // Удаляем предыдущие обработчики
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            // Добавляем новый обработчик
            newConfirmBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                if (typeof onConfirm === 'function') {
                    onConfirm(product);
                }
            });
        }
    },
    
    /**
     * Показывает уведомление об успешном действии
     * @param {string} message - текст уведомления
     */
    showSuccessNotification: function(message) {
        // Проверяем, существует ли уже уведомление
        let notification = document.getElementById('successNotification');
        
        // Если нет, создаем новое
        if (!notification) {
            notification = this._createNotification();
            document.body.appendChild(notification);
            this._setupNotificationEvents(notification);
        }
        
        // Заполняем сообщение
        const messageEl = document.getElementById('successMessage');
        if (messageEl) messageEl.textContent = message || 'Товар успешно добавлен в корзину';
        
        // Показываем уведомление
        notification.classList.add('active');
        
        // Автоматически скрываем через 3 секунды
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    },
    
    /**
     * Создает HTML модального окна
     * @private
     * @returns {HTMLElement} созданный элемент модального окна
     */
    _createModal: function() {
        const modal = document.createElement('div');
        modal.className = 'add-to-cart-modal';
        modal.id = 'addToCartModal';
        
        modal.innerHTML = `
            <div class="add-to-cart-modal__content">
                <div class="add-to-cart-modal__header">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h3>Добавление в корзину</h3>
                </div>
                <div class="add-to-cart-modal__message" id="modalMessage">
                    Товар "<strong id="modalProductName"></strong>" (<span id="modalArticle"></span>), цвет: <span id="modalColor"></span> будет добавлен в корзину.
                </div>
                <div class="add-to-cart-modal__actions">
                    <button class="btn btn__cancel" id="modalCancelBtn">Отмена</button>
                    <button class="btn btn__save" id="modalConfirmBtn">Добавить</button>
                </div>
            </div>
        `;
        
        return modal;
    },
    
    /**
     * Создает HTML уведомления
     * @private
     * @returns {HTMLElement} созданный элемент уведомления
     */
    _createNotification: function() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.id = 'successNotification';
        
        notification.innerHTML = `
            <div class="success-notification__icon">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="success-notification__content">
                <h4 class="success-notification__title">Товар добавлен в корзину</h4>
                <p class="success-notification__message" id="successMessage">Товар успешно добавлен в корзину</p>
            </div>
            <button class="success-notification__close" id="notificationCloseBtn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        
        return notification;
    },
    
    /**
     * Устанавливает обработчики событий для модального окна
     * @private
     * @param {HTMLElement} modal - элемент модального окна
     */
    _setupModalEvents: function(modal) {
        // Закрытие при клике на кнопку отмены
        const cancelBtn = document.getElementById('modalCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Закрытие при клике вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    },
    
    /**
     * Устанавливает обработчики событий для уведомления
     * @private
     * @param {HTMLElement} notification - элемент уведомления
     */
    _setupNotificationEvents: function(notification) {
        // Закрытие при клике на кнопку закрытия
        const closeBtn = document.getElementById('notificationCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('active');
            });
        }
    }
};

export default CartAlert; 