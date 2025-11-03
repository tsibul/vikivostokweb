'use strict';

// Генерация случайного математического вопроса для капчи
document.addEventListener('DOMContentLoaded', function () {
    // Генерируем случайные числа для капчи
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;

        document.getElementById('captcha-question').textContent = `Сколько будет ${num1} + ${num2}?`;
        document.getElementById('captcha-expected').value = answer;
    }

    // Генерируем капчу при загрузке страницы
    generateCaptcha();

    const contactForm = document.querySelector('.contact-form');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Проверяем капчу
        const userAnswer = document.getElementById('captcha-answer').value;
        const expectedAnswer = document.getElementById('captcha-expected').value;

        if (userAnswer != expectedAnswer) {
            // Если капча не пройдена
            const alertDiv = document.createElement('div');
            alertDiv.classList.add('alert', 'alert-danger');
            alertDiv.textContent = 'Неверный ответ на вопрос. Пожалуйста, попробуйте снова.';

            // Удаляем предыдущие сообщения
            const existingAlerts = document.querySelectorAll('.contact-form .alert');
            existingAlerts.forEach(alert => alert.remove());

            // Вставляем сообщение перед формой
            contactForm.parentNode.insertBefore(alertDiv, contactForm);

            // Генерируем новую капчу
            generateCaptcha();
            document.getElementById('captcha-answer').value = '';
            return;
        }

        const formData = new FormData(this);

        fetch('{% url "viki_web:contacts" %}', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Создаем элемент для сообщения
                const alertDiv = document.createElement('div');
                alertDiv.classList.add('alert');

                if (data.success) {
                    alertDiv.classList.add('alert-success');
                    alertDiv.textContent = data.message;
                    contactForm.reset(); // Очищаем форму при успешной отправке
                    generateCaptcha(); // Генерируем новую капчу
                } else {
                    alertDiv.classList.add('alert-danger');
                    alertDiv.textContent = data.message;
                }

                // Удаляем предыдущие сообщения
                const existingAlerts = document.querySelectorAll('.contact-form .alert');
                existingAlerts.forEach(alert => alert.remove());

                // Вставляем сообщение перед формой
                contactForm.parentNode.insertBefore(alertDiv, contactForm);

                // Прокручиваем к сообщению
                alertDiv.scrollIntoView({behavior: 'smooth'});
            })
            .catch(error => {
                console.error('Ошибка:', error);
                const alertDiv = document.createElement('div');
                alertDiv.classList.add('alert', 'alert-danger');
                alertDiv.textContent = 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.';

                // Удаляем предыдущие сообщения
                const existingAlerts = document.querySelectorAll('.contact-form .alert');
                existingAlerts.forEach(alert => alert.remove());

                // Вставляем сообщение перед формой
                contactForm.parentNode.insertBefore(alertDiv, contactForm);

                // Генерируем новую капчу
                generateCaptcha();
                document.getElementById('captcha-answer').value = '';
            });
    });
});
