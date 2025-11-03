/**
 * Cookie Storage Module
 * Handles saving and retrieving cookie consent preferences
 */

// Key for storing consent in localStorage
const COOKIE_CONSENT_KEY = 'cookie_consent';

/**
 * Get current cookie consent state
 * @returns {Object|null} Saved consent preferences or null if not set
 */
export function getCookieConsent() {
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  } catch (error) {
    console.error('Error getting cookie consent:', error);
    return null;
  }
}

/**
 * Save cookie consent preferences
 * @param {boolean} accepted - Whether cookies were accepted
 */
export function saveCookieConsent(accepted) {
  try {
    const consent = {
      accepted: accepted,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
} 