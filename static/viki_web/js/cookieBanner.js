/**
 * Cookie Banner Main Module
 * Entry point for cookie consent functionality
 */

import { initCookieConsent } from './cookie_policy/index.js';

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing cookie consent banner');
  initCookieConsent();
}); 