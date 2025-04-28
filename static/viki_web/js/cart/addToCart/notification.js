/**
 * Notification Module
 * Handles display of notifications when products are added to cart
 */

/**
 * Show notification about product added to cart
 * @param {Object} productData - Product data
 * @param {boolean} [exists=false] - Whether product already exists in cart
 * @param {number} [duration=3000] - Duration in ms to show notification
 */
export function showAddToCartNotification(productData, exists = false, duration = 3000) {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'success-notification active';

        if (exists) {
            // Product already exists notification
            notification.innerHTML = `
                <i class="fa-solid fa-info success-notification__icon"></i>
                <div class="success-notification__content">
                    <h4 class="success-notification__title">Товар уже в корзине</h4>
                    <p class="success-notification__message">
                        ${productData.name}
                        <br>
                        Артикул: ${productData.article}
                        <br>
                        Количество: ${productData.quantity}
                    </p>
                </div>
                <button class="success-notification__close">×</button>
            `;
        } else {
            // New product notification
            notification.innerHTML = `
                <i class="fa-solid fa-check success-notification__icon"></i>
                <div class="success-notification__content">
                    <h4 class="success-notification__title">Товар добавлен в корзину</h4>
                    <p class="success-notification__message">
                        ${productData.name}
                        <br>
                        Артикул: ${productData.article}
                    </p>
                </div>
                <button class="success-notification__close">×</button>
            `;
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Setup auto-close
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Setup close button
        notification.querySelector('.success-notification__close').addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        });
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

/**
 * Show error notification
 * @param {string} message - Error message
 * @param {number} [duration=3000] - Duration in ms to show notification
 */
export function showErrorNotification(message, duration = 3000) {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'success-notification active';

        notification.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle success-notification__icon"></i>
            <div class="success-notification__content">
                <h4 class="success-notification__title">Ошибка</h4>
                <p class="success-notification__message">${message}</p>
            </div>
            <button class="success-notification__close">×</button>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Setup auto-close
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Setup close button
        notification.querySelector('.success-notification__close').addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        });
    } catch (error) {
        console.error('Error showing error notification:', error);
    }
}

export function notificationClose(notification) {
    const closeBtn = notification.querySelector('.cart-notification__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('cart-notification--hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);

    // Show with animation
    setTimeout(() => {
        notification.classList.add('cart-notification--visible');
    }, 10);

}