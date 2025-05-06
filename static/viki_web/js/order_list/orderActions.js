/**
 * Модуль для обработки действий с заказами
 */
import { getCSRFToken } from '../common/getCSRFToken.js';

/**
 * Обработка действий с заказом
 * @param {string} action - тип действия (approve-branding, approve-price, cancel-price)
 * @param {string} orderId - ID заказа
 */
export function handleOrderAction(action, orderId) {
    // Подтверждение действия пользователем
    let confirmMessage = '';
    
    switch(action) {
        case 'approve-branding':
            confirmMessage = 'Вы уверены, что хотите подтвердить макет?';
            break;
        case 'approve-price':
            confirmMessage = 'Вы уверены, что хотите подтвердить новую цену?';
            break;
        case 'cancel-price':
            confirmMessage = 'Вы уверены, что хотите отменить заказ из-за изменения цены?';
            break;
        default:
            console.error('Неизвестное действие:', action);
            return;
    }
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Подготовка данных
    const formData = new FormData();
    formData.append('action', action);
    formData.append('order_id', orderId);
    
    // Отправка запроса
    fetch('/order_action/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Обновление страницы для отражения изменений
            location.reload();
        } else {
            alert(`Ошибка: ${data.message || 'Не удалось выполнить действие'}`);
        }
    })
    .catch(error => {
        console.error('Ошибка при выполнении действия:', error);
        alert('Произошла ошибка при выполнении действия');
    });
} 