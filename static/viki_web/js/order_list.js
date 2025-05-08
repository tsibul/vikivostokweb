'use strict';

import {showOrderFiles} from './order_list/filesModal.js';
import {showCommentsForm} from './order_list/commentsModal.js';
import {handleOrderAction} from './order_list/orderActions.js';
import {confirmOrderCancel} from './order_list/cancelModal.js';

// Модули будут созданы отдельно

document.addEventListener('DOMContentLoaded', () => {
    // Обработка кликов по dropdown меню
    document.querySelectorAll('.order-list__dropdown li').forEach(menuItem => {
        menuItem.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const action = menuItem.dataset.action;
            const orderId = menuItem.dataset.orderId;

            // Закрываем все выпадающие меню
            document.querySelectorAll('.order-list__dropdown').forEach(menu => {
                menu.classList.remove('show');
            });

            switch (action) {
                case 'show-files':
                    showOrderFiles(orderId);
                    break;
                case 'show-comments':
                    showCommentsForm(orderId);
                    break;
                case 'cancel-order':
                    confirmOrderCancel(orderId);
                    break;
                default:
                    menuItem.closest('ul').style.display = 'none';
                    await handleOrderAction(action, orderId);
                    break;
            }
        });
    });

    // Кнопка сброса поиска
    document.querySelector('form.layout__header-right .btn__cancel').addEventListener('click', () => {
        document.querySelector(`input[name="search"]`).value = null;
        window.location.href = window.location.pathname;
    });
});

