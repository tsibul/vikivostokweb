'use strict';

/**
 * Initializes the company save dialog with event listeners
 * @returns {void}
 */
export function initCompanySaveDialog() {
    const companySaveDialog = document.getElementById('company-dialog-save');
    const form = companySaveDialog.querySelector('form');
    const alert = form.querySelector('.alert');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cancelBtn = form.querySelector('button[type="reset"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        cancelBtn.disabled = true;
        const response = await fetch('/cabinet/save_new_company/', {
            method: 'POST',
            body: new FormData(form)
        });
        const result = await response.json();
        if (result.status === 'ok') {
            companySaveDialog.close();
            window.location.reload();
        } else {
            alert.textContent = result.message;
            submitBtn.disabled = false;
            cancelBtn.disabled = false;
        }
    });

    cancelBtn.addEventListener('click', () => {
        companySaveDialog.close();
    });
} 