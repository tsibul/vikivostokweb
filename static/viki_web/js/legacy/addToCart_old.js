'use strict';

// Функции для работы с корзиной
window.CartManager = window.CartManager || {
    // Получить корзину из localStorage
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    // Сохранить корзину в localStorage
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    // Обновить бейдж корзины
    updateBadge() {
        const cart = this.getCart();
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            // Показываем количество уникальных товаров в корзине
            const uniqueItems = cart.length;
            cartBadge.textContent = uniqueItems;
            cartBadge.style.display = uniqueItems > 0 ? 'block' : 'none';
        }
    },

    // Добавить товар в корзину
    addItem(itemData) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === itemData.id);
        
        if (existingItem) {
            this.showNotification(existingItem, true);
            return;
        }

        cart.push(itemData);
        this.saveCart(cart);
        this.updateBadge();
        this.showNotification(itemData, false);
    },

    // Показать уведомление
    showNotification(itemData, exists) {
        const notification = document.createElement('div');
        notification.className = 'success-notification active';
        
        if (exists) {
            // Сообщение для существующего товара
            notification.innerHTML = `
                <i class="fa-solid fa-info success-notification__icon"></i>
                <div class="success-notification__content">
                    <h4 class="success-notification__title">Товар уже в корзине</h4>
                    <p class="success-notification__message">
                        ${itemData.name}
                        <br>
                        Артикул: ${itemData.article}
                        <br>
                        Количество: ${itemData.quantity}
                    </p>
                </div>
                <button class="success-notification__close">×</button>
            `;
        } else {
            // Сообщение для нового товара
            notification.innerHTML = `
                <i class="fa-solid fa-check success-notification__icon"></i>
                <div class="success-notification__content">
                    <h4 class="success-notification__title">Товар добавлен в корзину</h4>
                    <p class="success-notification__message">
                        ${itemData.name}
                        <br>
                        Артикул: ${itemData.article}
                    </p>
                </div>
                <button class="success-notification__close">×</button>
            `;
        }
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        notification.querySelector('.success-notification__close').addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация бейджа корзины при загрузке страницы
    CartManager.updateBadge();

    // Обработка кликов по кнопкам "В корзину"
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (!addToCartBtn) return;

        e.preventDefault();
        
        const productContainer = addToCartBtn.closest('.product, .detail-page__content, .recently-viewed__item');
        if (!productContainer) return;

        let itemData = {
            quantity: 1
        };

        // Для recently-viewed товаров
        if (productContainer.classList.contains('recently-viewed__item')) {
            const activeImage = productContainer.querySelector('img:not(.item-hidden)');
            if (!activeImage) return;

            itemData = {
                ...itemData,
                id: activeImage.dataset.id,
                goodsId: productContainer.dataset.id,
                name: productContainer.querySelector('.recently-viewed__name').textContent.trim(),
                article: productContainer.querySelector('.recently-viewed__article').textContent.trim(),
                price: parseFloat(productContainer.querySelector('.recently-viewed__price').textContent.replace(/[^\d.]/g, '')),
                image: activeImage.src || '/static/viki_web/icons/logo.svg',
                description: productContainer.querySelector('.recently-viewed__description')?.textContent.trim()
            };
        } 
        // Для товаров в каталоге и на странице товара
        else {
            const activeImage = productContainer.querySelector('.product-hor__image-frame:not(.item-hidden), .detail-page__main-image img:not(.item-hidden)');
            if (!activeImage) return;

            itemData = {
                ...itemData,
                id: activeImage.dataset.id,
                name: productContainer.querySelector('h3').textContent.trim(),
                goodsId: productContainer.dataset.id,
                article: activeImage.dataset.article,
                price: parseFloat(activeImage.dataset.price),
                image: activeImage.tagName === 'IMG' ? activeImage.src : activeImage.querySelector('img')?.src || '/static/viki_web/icons/logo.svg',
                description: activeImage.dataset.description
            };
        }

        CartManager.addItem(itemData);
    });
}); 