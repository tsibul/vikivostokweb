/**
 * Модуль для работы с модальным окном информации о менеджере
 */

/**
 * Показать модальное окно с информацией о менеджере
 * @param {string} name - имя менеджера
 * @param {string} email - email менеджера
 * @param {string} phone - телефон менеджера
 */
export function showManagerInfo(name, email, phone) {
    // Получение элементов DOM
    const modal = document.getElementById('manager-modal');
    const nameElement = document.getElementById('manager-name');
    const emailElement = document.getElementById('manager-email');
    const phoneElement = document.getElementById('manager-phone');
    const closeButton = modal.querySelector('.modal__close');
    
    // Заполнение данными
    nameElement.textContent = name;
    emailElement.textContent = email || 'Не указан';
    phoneElement.textContent = phone || 'Не указан';
    
    // Показ модального окна
    modal.classList.add('modal_active');
    
    // Обработчик закрытия
    const closeModal = () => {
        modal.classList.remove('modal_active');
        closeButton.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', handleEscape);
    };
    
    // Закрытие по клику на крестик
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