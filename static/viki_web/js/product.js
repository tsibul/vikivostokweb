'use strict'

const colorInputs = document.querySelectorAll('.product-header__filter-content_checkbox-hidden');


colorInputs.forEach(colorInput => {
    colorInput.addEventListener('change', (e) => {
        const label = document
            .querySelector(`label[for="${colorInput.id}"]`)
            .querySelector('.color-label__check');
        colorInput.checked ? label.style.display = 'block': label.style.display = 'none';
    })
})
