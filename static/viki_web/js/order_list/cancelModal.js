/**
 * @fileoverview Module for handling order cancellation modal window
 * @module order_list/cancelModal
 */

'use strict';

import {modalDnD} from '../common/modalDnD.js';
import {handleOrderAction} from './orderActions.js';
import {showErrorNotification} from "../cart/addToCart/notification.js";

/**
 * Shows modal window to confirm order cancellation
 * @param {string} orderId - Order ID to cancel
 */
export function confirmOrderCancel(orderId) {
    const modal = document.getElementById('cancelModal');
    const confirmButton = document.getElementById('confirmCancel');
    const closeButton = document.getElementById('closeCancelModal');
    const cancelBtn = modal.querySelector('.btn__cancel');

    // Show modal
    modal.showModal();
    modalDnD(modal);

    // Confirm cancel handler
    const handleConfirm = async () => {
        try {
            await handleOrderAction('cancel-order', orderId);
            modal.close();
        } catch (error) {
            console.error('Error cancelling order:', error);
            showErrorNotification('Ошибка при отмене заказа');
        }
    };

    // Add event listeners
    confirmButton.addEventListener('click', handleConfirm);
    closeButton.addEventListener('click', () =>{
        modal.close()
    });
    cancelBtn.addEventListener('click', () =>{
        modal.close()
    });

}