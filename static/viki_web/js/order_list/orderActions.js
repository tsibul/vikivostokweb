/**
 * @fileoverview Module for handling order actions
 * @module order_list/orderActions
 */

'use strict';

import {getCSRFToken} from "../common/getCSRFToken.js";

/**
 * Handles order actions (approve, decline, etc)
 * @param {string} action - Action to perform
 * @param {string} orderId - Order ID to perform action on
 * @returns {Promise} Promise that resolves when action is complete
 */
export async function handleOrderAction(action, orderId) {
    // Create form data

    const formData = new FormData();
    formData.append('action', action);
    formData.append('order_id', orderId);

    try {
        const response = await fetch('/order_action/', {
            method: 'POST',
            body: formData,
            headers: {
                "X-CSRFToken": getCSRFToken(),
            },
        });

        const data = await response.json()

        if (data.status === 'success') {
            // Reload page to show updated state
            location.reload();
        } else {
            location.reload();
            throw new Error(data.message || 'Ошибка при выполнении действия');
        }
    } catch (error) {
        console.error('Error performing action:', error);
        throw error;
    }
} 