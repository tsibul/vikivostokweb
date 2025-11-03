/**
 * Cart Fallback Module
 * Used for browsers that don't support ES modules
 */

(function() {
    'use strict';
    
    // Simple cart functionality for legacy browsers
    window.CartManager = window.CartManager || {
        // Get cart from localStorage
        getCart: function() {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        },
        
        // Save cart to localStorage
        saveCart: function(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        },
        
        // Update cart badge
        updateBadge: function() {
            var cart = this.getCart();
            var cartBadges = document.querySelectorAll('.cart-badge');
            
            for (var i = 0; i < cartBadges.length; i++) {
                var badge = cartBadges[i];
                var count = cart.length;
                badge.textContent = count;
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        },
        
        // Add item to cart
        addItem: function(itemData) {
            var cart = this.getCart();
            var existingItemIndex = -1;
            
            // Find existing item
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id === itemData.id) {
                    existingItemIndex = i;
                    break;
                }
            }
            
            if (existingItemIndex !== -1) {
                // Item exists, show notification
                this.showNotification(cart[existingItemIndex], true);
                return;
            }
            
            // Add item to cart
            cart.push(itemData);
            this.saveCart(cart);
            this.updateBadge();
            this.showNotification(itemData, false);
        },
        
        // Show notification
        showNotification: function(itemData, exists) {
            var notification = document.createElement('div');
            notification.className = 'success-notification active';
            
            if (exists) {
                // Message for existing item
                notification.innerHTML = '<i class="fa-solid fa-info success-notification__icon"></i>' +
                    '<div class="success-notification__content">' +
                    '<h4 class="success-notification__title">Товар уже в корзине</h4>' +
                    '<p class="success-notification__message">' +
                    itemData.name + '<br>Артикул: ' + itemData.article + '<br>Количество: ' + itemData.quantity +
                    '</p></div>' +
                    '<button class="success-notification__close">×</button>';
            } else {
                // Message for new item
                notification.innerHTML = '<i class="fa-solid fa-check success-notification__icon"></i>' +
                    '<div class="success-notification__content">' +
                    '<h4 class="success-notification__title">Товар добавлен в корзину</h4>' +
                    '<p class="success-notification__message">' +
                    itemData.name + '<br>Артикул: ' + itemData.article +
                    '</p></div>' +
                    '<button class="success-notification__close">×</button>';
            }
            
            document.body.appendChild(notification);
            
            setTimeout(function() {
                notification.classList.remove('active');
                setTimeout(function() {
                    notification.remove();
                }, 300);
            }, 3000);
            
            notification.querySelector('.success-notification__close').addEventListener('click', function() {
                notification.classList.remove('active');
                setTimeout(function() {
                    notification.remove();
                }, 300);
            });
        }
    };
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize cart badge
        CartManager.updateBadge();
        
        // Handle clicks on "Add to cart" buttons
        document.addEventListener('click', function(e) {
            var addToCartBtn = e.target.closest('.add-to-cart');
            if (!addToCartBtn) return;
            
            e.preventDefault();
            
            var productContainer = addToCartBtn.closest('.product, .detail-page__content, .recently-viewed__item');
            if (!productContainer) return;
            
            var itemData = {
                quantity: 1,
                branding: []
            };
            
            // For recently-viewed products
            if (productContainer.classList.contains('recently-viewed__item')) {
                var activeImage = productContainer.querySelector('img:not(.item-hidden)');
                if (!activeImage) return;
                
                itemData.id = activeImage.dataset.id;
                itemData.goodsId = productContainer.dataset.id;
                itemData.name = productContainer.querySelector('.recently-viewed__name').textContent.trim();
                itemData.article = productContainer.querySelector('.recently-viewed__article').textContent.trim();
                itemData.price = parseFloat(productContainer.querySelector('.recently-viewed__price').textContent.replace(/[^\d.,]/g, '').replace(',', '.'));
                itemData.image = activeImage.src || '/static/viki_web/icons/logo.svg';
                
                var description = productContainer.querySelector('.recently-viewed__description');
                itemData.description = description ? description.textContent.trim() : '';
            }
            // For products in catalog and product page
            else {
                var activeImage = productContainer.querySelector('.product-hor__image-frame:not(.item-hidden), .detail-page__main-image img:not(.item-hidden)');
                if (!activeImage) return;
                
                itemData.id = activeImage.dataset.id;
                itemData.name = productContainer.querySelector('h1, h2, h3').textContent.trim();
                itemData.goodsId = productContainer.dataset.id;
                itemData.article = activeImage.dataset.article;
                itemData.price = parseFloat(activeImage.dataset.price) || 0;
                
                // Get image
                if (activeImage.tagName === 'IMG') {
                    itemData.image = activeImage.src;
                } else {
                    var img = activeImage.querySelector('img');
                    itemData.image = img ? img.src : '/static/viki_web/icons/logo.svg';
                }
                
                itemData.description = activeImage.dataset.description || '';
            }
            
            CartManager.addItem(itemData);
        });
    });
})(); 