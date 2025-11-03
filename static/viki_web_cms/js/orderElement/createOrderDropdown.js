'use strict';

export function createOrderDropdown(data, initialId, name) {
    // Create container
    const container = document.createElement('div');
    container.classList.add('dropdown');
    
    // Create hidden input for id
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = name;
    container.appendChild(hiddenInput);
    
    // Create input for filtering
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.classList.add('modal__content_text', 'dropdown__input')
    container.appendChild(filterInput);
    const chevron = `<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>`;
    container.insertAdjacentHTML('beforeend', chevron);
    
    // Create dropdown list
    const dropdownList = document.createElement('ul');
    dropdownList.style.display = 'none';
    dropdownList.classList.add('dropdown__list');
    container.appendChild(dropdownList);
    
    // Create and populate list items
    data.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('dropdown__list_item')
        li.textContent = item.value;
        li.dataset.id = item.id;
        
        // Add click handler
        li.addEventListener('click', () => {
            hiddenInput.value = item.id;
            filterInput.value = item.value;
            dropdownList.style.display = 'none';
        });
        
        dropdownList.appendChild(li);
    });
    
    // Initialize with initialId if provided
    if (initialId) {
        const initialItem = data.find(item => item.id === parseInt(initialId));
        if (initialItem) {
            hiddenInput.value = initialItem.id;
            filterInput.value = initialItem.value;
        }
    }
    
    // Add filter functionality
    filterInput.addEventListener('input', () => {
        const searchText = filterInput.value.toLowerCase();
        const items = dropdownList.getElementsByTagName('li');
        
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchText) ? '' : 'none';
        });
    });
    
    // Toggle dropdown on input click
    filterInput.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownList.style.display = dropdownList.style.display === 'none' ? '' : 'none';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdownList.style.display = 'none';
        }
    });
    
    return container;
}