'use strict';

/**
 * Custom Dropdown Component
 * Implements custom dropdown functionality for ul-li based dropdowns
 */
class VikiDropdown {
    // Хранилище для экземпляров dropdown
    static instances = new Map();
    
    /**
     * Initialize the dropdown
     * @param {HTMLElement|string} element - Dropdown element or selector
     * @param {Object} options - Configuration options
     */
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            onChange: options.onChange || function() {},
            onOpen: options.onOpen || function() {},
            onClose: options.onClose || function() {}
        };
        
        this.isOpen = false;
        this._initElements();
        this._initEvents();
        
        // Store instance in the static map
        VikiDropdown.instances.set(this.element, this);
    }
    
    _initElements() {
        this.trigger = this.element.querySelector('.viki-dropdown__trigger');
        this.triggerText = this.trigger.querySelector('.viki-dropdown__trigger-text');
        this.menu = this.element.querySelector('.viki-dropdown__menu');
        this.items = this.menu.querySelectorAll('.viki-dropdown__menu-link');
        this.hiddenInput = this.element.querySelector('input[type="hidden"]');
    }
    
    /**
     * Initialize dropdown event listeners
     * @private
     */
    _initEvents() {
        // Клонируем триггер, чтобы удалить все обработчики событий
        const newTrigger = this.trigger.cloneNode(true);
        this.trigger.parentNode.replaceChild(newTrigger, this.trigger);
        this.trigger = newTrigger;
        
        // Обновляем элементы после клонирования
        this.triggerText = this.trigger.querySelector('.viki-dropdown__trigger-text');
        
        // Добавляем обработчик клика на триггер
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });
        
        // Клонируем элементы, чтобы удалить все обработчики событий
        const newItems = [];
        this.items.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            newItems.push(newItem);
            
            // Добавляем обработчик клика на каждый пункт
            newItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = newItem.dataset.value;
                this.setValue(value);
                
                // Обновляем текст триггера
                this.triggerText.textContent = newItem.textContent;
                
                // Вызываем callback
                this.options.onChange(value, newItem);
                
                // Закрываем дропдаун
                this.close();
            });
        });
        this.items = newItems;
        
        // Обработчик клика вне дропдауна (закрытие)
        if (!document.dropdownClickListener) {
            document.dropdownClickListener = (e) => {
                const clickedOutside = !e.target.closest('.viki-dropdown');
                if (clickedOutside) {
                    const openDropdowns = document.querySelectorAll('.viki-dropdown--open');
                    openDropdowns.forEach(dropdown => {
                        const instance = dropdown.vikiDropdownInstance;
                        if (instance) {
                            instance.close();
                        } else {
                            dropdown.classList.remove('viki-dropdown--open');
                        }
                    });
                }
            };
            document.addEventListener('click', document.dropdownClickListener);
        }
        
        // Обработчик нажатия ESC (закрытие)
        if (!document.dropdownKeyListener) {
            document.dropdownKeyListener = (e) => {
                if (e.key === 'Escape') {
                    const openDropdowns = document.querySelectorAll('.viki-dropdown--open');
                    openDropdowns.forEach(dropdown => {
                        const instance = dropdown.vikiDropdownInstance;
                        if (instance) {
                            instance.close();
                        } else {
                            dropdown.classList.remove('viki-dropdown--open');
                        }
                    });
                }
            };
            document.addEventListener('keydown', document.dropdownKeyListener);
        }
        
        // Сохраняем экземпляр в элементе для доступа извне
        this.element.vikiDropdownInstance = this;
    }
    
    /**
     * Toggle dropdown open/close state
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    /**
     * Open the dropdown
     */
    open() {
        // Закрываем все остальные открытые дропдауны
        const openDropdowns = document.querySelectorAll('.viki-dropdown--open');
        openDropdowns.forEach(dropdown => {
            if (dropdown !== this.element) {
                const instance = dropdown.vikiDropdownInstance;
                if (instance) {
                    instance.close();
                } else {
                    dropdown.classList.remove('viki-dropdown--open');
                }
            }
        });
        
        this.element.classList.add('viki-dropdown--open');
        this.isOpen = true;
        this.options.onOpen();
    }
    
    /**
     * Close the dropdown
     */
    close() {
        this.element.classList.remove('viki-dropdown--open');
        this.isOpen = false;
        this.options.onClose();
    }
    
    /**
     * Set the active dropdown item
     * @param {HTMLElement} activeItem - The item to set as active
     * @private
     */
    _setActiveItem(activeItem) {
        // Remove active class from all items
        this.items.forEach(item => {
            item.classList.remove('viki-dropdown__menu-link--active');
        });
        
        // Add active class to selected item
        activeItem.classList.add('viki-dropdown__menu-link--active');
    }
    
    /**
     * Select an item by value
     * @param {string} value - The value of the item to select
     */
    selectItem(value) {
        const item = Array.from(this.items).find(
            item => item.dataset.value === value || item.textContent === value
        );
        
        if (item) {
            this._setActiveItem(item);
            
            // Call onChange callback
            if (typeof this.options.onChange === 'function') {
                this.options.onChange(value, item);
            }
        }
    }
    
    /**
     * Set dropdown items programmatically
     * @param {Array} items - Array of items to set
     * @param {string} selectedValue - Value to select after setting items
     */
    setItems(items, selectedValue = null) {
        if (!Array.isArray(items) || !this.menu) return;
        
        const listElement = this.menu.querySelector('.viki-dropdown__menu-list');
        if (!listElement) return;
        
        // Clear existing items
        listElement.innerHTML = '';
        
        // Add new items
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'viki-dropdown__menu-item';
            
            const a = document.createElement('a');
            a.className = 'viki-dropdown__menu-link';
            a.href = '#';
            a.textContent = item.label || item.text || item;
            
            if (item.value) {
                a.dataset.value = item.value;
            }
            
            if (item.disabled) {
                a.classList.add('viki-dropdown__menu-link--disabled');
            }
            
            if ((item.value && item.value === selectedValue) || 
                (item.label && item.label === selectedValue) ||
                (typeof item === 'string' && item === selectedValue)) {
                a.classList.add('viki-dropdown__menu-link--active');
            }
            
            li.appendChild(a);
            listElement.appendChild(li);
        });
        
        // Reinitialize items and events
        this.items = this.menu.querySelectorAll('.viki-dropdown__menu-link');
        this._initEvents();
    }
    
    /**
     * Initialize all dropdowns in the document
     * @param {Object} options - Default options for all dropdowns
     * @return {Array} - Array of VikiDropdown instances
     */
    static initAll(options = {}) {
        const dropdownElements = document.querySelectorAll('.viki-dropdown');
        return Array.from(dropdownElements).map(element => {
            return new VikiDropdown(element, options);
        });
    }
    
    /**
     * Get dropdown instance by element
     * @param {HTMLElement|string} element - DOM element or selector
     * @return {VikiDropdown|null} - The VikiDropdown instance or null if not found
     */
    static getInstance(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return null;
        return VikiDropdown.instances.get(el) || null;
    }
    
    setValue(value) {
        // Устанавливаем значение в hidden input
        if (this.hiddenInput) {
            this.hiddenInput.value = value;
        }
        
        // Обновляем активный элемент в списке
        this.items.forEach(item => {
            if (item.dataset.value === value) {
                item.classList.add('viki-dropdown__menu-link--active');
                // Обновляем текст триггера
                this.triggerText.textContent = item.textContent;
            } else {
                item.classList.remove('viki-dropdown__menu-link--active');
            }
        });
    }
    
    getValue() {
        return this.hiddenInput ? this.hiddenInput.value : null;
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VikiDropdown;
} else {
    window.VikiDropdown = VikiDropdown;
} 