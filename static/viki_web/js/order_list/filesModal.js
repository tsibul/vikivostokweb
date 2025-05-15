/**
 * @fileoverview Module for handling order files modal window
 * @module order_list/filesModal
 */

'use strict';

import {modalDnD} from '../common/modalDnD.js';
import {fetchJsonData} from '../common/fetchJsonData.js';
import {showErrorNotification} from "../cart/addToCart/notification.js";

/**
 * Shows modal window with order files
 * @param {string} orderId - Order ID to show files for
 */
export function showOrderFiles(orderId) {
    const modal = document.getElementById('filesModal');
    const filesList = document.getElementById('filesList');
    const filesEmpty = document.getElementById('filesEmpty');
    const closeButton = modal.querySelector('.order-list-modal__close');

    if (!modal || !filesList || !filesEmpty) {
        console.error('Modal elements not found');
        return;
    }

    // Show loading state
    filesList.innerHTML = '<li>Загрузка файлов...</li>';
    filesEmpty.style.display = 'none';

    // Fetch files
    fetchJsonData(`/order_files/?order_id=${orderId}`)
        .then(data => {
            filesList.innerHTML = '';
            if (data.status === 'success' && data.files && data.files.length > 0) {
                data.files.forEach(file => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.textContent = file.name;
                    a.target = '_blank';
                    li.appendChild(a);
                    filesList.appendChild(li);
                });
                filesEmpty.style.display = 'none';
            } else {
                filesEmpty.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error loading files:', error);
            filesList.innerHTML = '';
            filesEmpty.style.display = 'block';
            showErrorNotification('Ошибка загрузки файлов');
        });

    // Close handlers
    const closeModal = () => {
        modal.close();
        closeButton.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', handleEscape);
    };
    
    closeButton.addEventListener('click', closeModal);
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Show modal
    modal.showModal();
    
    // Initialize drag and drop
    modalDnD(modal);
} 