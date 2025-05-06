/**
 * Модуль для работы с модальным окном файлов заказа
 */
import { fetchJsonData } from '../common/fetchJsonData.js';

/**
 * Показать модальное окно с файлами заказа
 * @param {string} orderId - ID заказа
 */
export function showOrderFiles(orderId) {
    // Получение элементов DOM
    const modal = document.getElementById('files-modal');
    const filesList = document.getElementById('files-list');
    const emptyMessage = document.getElementById('files-empty');
    const closeButton = modal.querySelector('.modal__close');
    
    // Показ модального окна с индикатором загрузки
    modal.classList.add('modal_active');
    filesList.innerHTML = '<li>Загрузка списка файлов...</li>';
    emptyMessage.style.display = 'none';
    
    // Загрузка данных с сервера
    const url = `/order_files/?order_id=${orderId}`;
    
    fetchJsonData(url)
        .then(data => {
            if (data.status === 'success' && data.files && data.files.length > 0) {
                // Заполнение списка файлов
                filesList.innerHTML = '';
                data.files.forEach(file => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.textContent = file.name;
                    a.target = '_blank';
                    li.appendChild(a);
                    filesList.appendChild(li);
                });
                
                filesList.style.display = 'block';
                emptyMessage.style.display = 'none';
            } else {
                // Показ сообщения об отсутствии файлов
                filesList.style.display = 'none';
                emptyMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки файлов:', error);
            filesList.style.display = 'none';
            emptyMessage.textContent = 'Ошибка загрузки файлов';
            emptyMessage.style.display = 'block';
        });
    
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