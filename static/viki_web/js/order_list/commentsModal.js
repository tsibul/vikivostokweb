/**
 * Модуль для работы с модальным окном комментариев к заказу
 */
import { getCSRFToken } from '../common/getCSRFToken.js';

/**
 * Показать модальное окно с формой комментариев
 * @param {string} orderId - ID заказа
 */
export function showCommentsForm(orderId) {
    // Получение элементов DOM
    const modal = document.getElementById('comments-modal');
    const form = document.getElementById('comment-form');
    const orderIdField = document.getElementById('comment-order-id');
    const commentText = document.getElementById('comment-text');
    const closeButton = modal.querySelector('.modal__close');
    
    // Заполнение данными
    orderIdField.value = orderId;
    commentText.value = '';
    
    // Показ модального окна
    modal.classList.add('modal_active');
    commentText.focus();
    
    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Проверка на пустой комментарий
        if (!commentText.value.trim()) {
            alert('Пожалуйста, введите комментарий');
            return;
        }
        
        // Подготовка данных для отправки
        const formData = new FormData();
        formData.append('action', 'send-comment');
        formData.append('order_id', orderId);
        formData.append('comment', commentText.value);
        
        // Отправка на сервер
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
                alert('Комментарий успешно отправлен');
                closeModal();
            } else {
                alert(`Ошибка: ${data.message || 'Не удалось отправить комментарий'}`);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке комментария:', error);
            alert('Ошибка при отправке комментария');
        });
    };
    
    // Обработчик закрытия
    const closeModal = () => {
        modal.classList.remove('modal_active');
        form.removeEventListener('submit', handleSubmit);
        closeButton.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', handleEscape);
    };
    
    // Регистрация обработчиков
    form.addEventListener('submit', handleSubmit);
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