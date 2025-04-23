/**
 * Cookie Consent Module
 * Handles cookie consent banner and modal functionality
 */

import { getCookieConsent, saveCookieConsent } from './cookieStorage.js';

/**
 * Show cookie settings modal
 */
export function showCookieModal() {
  const modal = document.getElementById('cookie-policy-modal');
  if (modal) {
    modal.classList.add('cookie-policy-modal--visible');
  }
}

/**
 * Initialize cookie consent banner
 */
export function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-policy-modal');
  
  if (!banner) {
    console.log('Cookie banner element not found.');
    return;
  }
  
  // Check if consent already given
  const consent = getCookieConsent();
  if (consent) {
    // Consent already given, no need to show banner
    return;
  }
  
  // Get buttons
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const policyBtn = document.getElementById('cookie-policy-link');
  
  if (modal) {
    const closeBtn = document.getElementById('cookie-policy-close');
    const modalAcceptBtn = document.getElementById('cookie-policy-accept');
    const modalDeclineBtn = document.getElementById('cookie-policy-decline');
    
    // Setup modal buttons
    if (closeBtn) {
      closeBtn.addEventListener('click', () => hideModal());
    }
    
    if (modalAcceptBtn) {
      modalAcceptBtn.addEventListener('click', () => {
        acceptCookies();
        hideModal();
      });
    }
    
    if (modalDeclineBtn) {
      modalDeclineBtn.addEventListener('click', () => {
        declineCookies();
        hideModal();
      });
    }
    
    // Close on click outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
    
    // Policy button action
    if (policyBtn) {
      policyBtn.addEventListener('click', () => showModal());
    }
  }
  
  // Setup banner buttons
  if (acceptBtn) {
    acceptBtn.addEventListener('click', acceptCookies);
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', declineCookies);
  }
  
  // Show banner after a short delay
  setTimeout(() => {
    banner.classList.add('cookie-banner--visible');
  }, 1000);
  
  // Functions
  function acceptCookies() {
    saveCookieConsent(true);
    hideBanner();
  }
  
  function declineCookies() {
    saveCookieConsent(false);
    hideBanner();
  }
  
  function hideBanner() {
    banner.classList.remove('cookie-banner--visible');
  }
  
  function showModal() {
    if (modal) {
      modal.classList.add('cookie-policy-modal--visible');
    }
  }
  
  function hideModal() {
    if (modal) {
      modal.classList.remove('cookie-policy-modal--visible');
    }
  }
} 