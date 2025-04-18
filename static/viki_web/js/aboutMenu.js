/**
 * @fileoverview Module for handling the about menu dropdown
 * @module aboutMenu
 */

'use strict';

/**
 * Initializes the about menu dropdown functionality
 */
export function initAboutMenu() {
    // Initialize about dropdown menu hover effect for better mobile experience
    const aboutMenu = document.querySelector('.about-menu');
    if (aboutMenu) {
        aboutMenu.addEventListener('click', function(e) {
            // Only handle the click if it's directly on the "О компании" text
            if (e.target.textContent === 'О компании' && e.target.parentElement === this) {
                e.preventDefault();
                const dropdown = this.querySelector('.about-menu__dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('force-display');
                }
            }
        });
        
        // Hide dropdown when clicking outside of it
        document.addEventListener('click', function(e) {
            if (!aboutMenu.contains(e.target)) {
                const dropdown = aboutMenu.querySelector('.about-menu__dropdown');
                if (dropdown) {
                    dropdown.classList.remove('force-display');
                }
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAboutMenu();
}); 