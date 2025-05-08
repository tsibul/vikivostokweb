/**
 * @fileoverview Module for handling order comments modal window
 * @module order_list/commentsModal
 */

'use strict';

import {modalDnD} from '../common/modalDnD.js';
import {showErrorNotification} from "../cart/addToCart/notification.js";
import {getCSRFToken} from "../common/getCSRFToken.js";
import {validateCustomerComment} from "../order/validation.js";

/**
 * Shows modal window for adding comments to order
 * @param {string} orderId - Order ID to add comment to
 */
export function showCommentsForm(orderId) {
    const modal = document.getElementById('commentsModal');
    const form = modal.querySelector('form');
    const orderIdInput = document.getElementById('commentOrderId');
    const commentText = document.getElementById('commentText');
    const closeButton = modal.querySelector('.order-list-modal__close');
    const cancelBtn = modal.querySelector(".btn__cancel")
    const title = modal.querySelector('.login__title');

    // Set modal title based on comment type
    title.firstElementChild.textContent = 'Комментарий к заказу'

    // Set order ID
    orderIdInput.value = orderId;

    // Clear previous comment
    commentText.value = '';

    // Show modal
    modal.showModal();
    modalDnD(modal);
    commentText.focus();

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validateCustomerComment(commentText.value)) {
            showErrorNotification('Недопустимые символы в комментарии');
            return
        }

        try {
            const formData = new FormData(form);
            formData.append('action', 'send-comment');

            const response = await fetch('/order_action/', {
                method: 'POST',
                body: formData,
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                },
            });

            const data = await response.json()

            if (data.status === 'success') {
                modal.close()
            } else {
                showErrorNotification(data.message || 'Не удалось отправить комментарий');
            }
        } catch (error) {
            console.error('Error sending comment:', error);
            showErrorNotification('Ошибка при отправке комментария');
        }
    };

    form.addEventListener('submit', handleSubmit);
    closeButton.addEventListener('click', () => {
        modal.close();
    });
    cancelBtn.addEventListener('click', () => {
        modal.close();
    });
}