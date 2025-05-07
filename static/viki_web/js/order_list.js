'use strict';

import {getCSRFToken} from './common/getCSRFToken.js';
import {modalDnD} from './common/modalDnD.js';
import {showOrderFiles} from './order_list/filesModal.js';
import {showCommentsForm} from './order_list/commentsModal.js';
import {handleOrderAction} from './order_list/orderActions.js';
import {confirmOrderCancel} from './order_list/cancelModal.js';

// Модули будут созданы отдельно

document.addEventListener('DOMContentLoaded', () => {
    // // Инициализация drag-n-drop для модальных окон
    // modalDnD();

    // Обработка открытия details
    document.querySelectorAll('.order-item').forEach(orderItem => {
        // Стоп-пропагация для кнопок внутри summary
        orderItem.querySelector('summary').addEventListener('click', (e) => {
            if (e.target.closest('button')) {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем открытие details при клике на кнопки
            }
        });
    });

    // Обработка кликов по статусу заказа для отображения кнопок действий
    document.querySelectorAll('.order-state').forEach(stateElement => {
        const actionContainer = stateElement.querySelector('.order-action');
        if (actionContainer) {
            stateElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем срабатывание клика по summary

                // Показываем кнопки действий только для текущего элемента
                document.querySelectorAll('.order-action').forEach(action => {
                    action.classList.remove('order-action_visible');
                });

                actionContainer.classList.toggle('order-action_visible');
            });
        }
    });

    // Обработка кликов на кнопки действий с заказом
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const action = button.dataset.action;
            const orderId = button.dataset.orderId;

            handleOrderAction(action, orderId);
        });
    });

    // Показать файлы заказа
    document.querySelectorAll('.order-button_files').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const orderId = button.dataset.orderId;
            showOrderFiles(orderId);
        });
    });

    // Показать форму комментария
    document.querySelectorAll('.order-button_comments').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const orderId = button.dataset.orderId;
            showCommentsForm(orderId);
        });
    });

    // Отмена заказа
    document.querySelectorAll('.order-button_cancel').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const orderId = button.dataset.orderId;
            confirmOrderCancel(orderId);
        });
    });

    // Кнопка повторения заказа
    document.querySelectorAll('.order-button_repeat').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const orderId = button.dataset.orderId;
            window.location.href = `/order/repeat/${orderId}/`;
        });
    });

    // Кнопка сброса поиска
    document.querySelector('.order-search__clear')?.addEventListener('click', () => {
        window.location.href = window.location.pathname;
    });

    // Закрытие кнопок действий при клике вне элемента
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.order-state')) {
            document.querySelectorAll('.order-action').forEach(action => {
                action.classList.remove('order-action_visible');
            });
        }
    });
});