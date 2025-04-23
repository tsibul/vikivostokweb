/**
 * Cookie Banner Main Module
 * Entry point for cookie consent functionality
 */

import { initCookieConsent, showCookieModal } from './cookie_policy/index.js';

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing cookie consent banner');
  initCookieConsent();
  
  // Add handler for footer cookie settings link
  const footerCookieLink = document.getElementById('cookie-settings-footer');
  if (footerCookieLink) {
    footerCookieLink.addEventListener('click', (e) => {
      e.preventDefault();
      showCookieModal();
    });
  }
}); 