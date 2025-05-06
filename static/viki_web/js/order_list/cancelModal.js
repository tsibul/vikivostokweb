/**
 * Модуль для работы с модальным окном отмены заказа
 */
import { getCSRFToken } from '../common/getCSRFToken.js';

/**
 * Показать модальное окно подтверждения отмены заказа
 * @param {string} orderId - ID заказа
 */
export function confirmOrderCancel(orderId) {
    // Получение элементов DOM
    const modal = document.getElementById('cancel-modal');
    const confirmButton = document.getElementById('cancel-order-yes');
    const cancelButton = document.getElementById('cancel-order-no');
    const closeButton = modal.querySelector('.modal__close');
    
    // Установка ID заказа для кнопки подтверждения
    confirmButton.dataset.orderId = orderId;
    
    // Показ модального окна
    modal.classList.add('modal_active');
    
    // Обработчик подтверждения отмены
    const handleConfirm = () => {
        // Подготовка данных
        const formData = new FormData();
        formData.append('action', 'cancel-order');
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
                alert(`Ошибка: ${data.message || 'Не удалось отменить заказ'}`);
                closeModal();
            }
        })
        .catch(error => {
            console.error('Ошибка при отмене заказа:', error);
            alert('Произошла ошибка при отмене заказа');
            closeModal();
        });
    };
    
    // Обработчик закрытия
    const closeModal = () => {
        modal.classList.remove('modal_active');
        confirmButton.removeEventListener('click', handleConfirm);
        cancelButton.removeEventListener('click', closeModal);
        closeButton.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', handleEscape);
    };
    
    // Регистрация обработчиков
    confirmButton.addEventListener('click', handleConfirm);
    cancelButton.addEventListener('click', closeModal);
    closeButton.addEventListener('click', closeModal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по нажатию Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    
    document.addEventListener('keydown', handleEscape);
} 