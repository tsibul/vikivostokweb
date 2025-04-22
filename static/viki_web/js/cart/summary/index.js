/**
 * Summary Module Index
 * Exports all cart summary functionality
 */

import { 
    calculateSummary, 
    updateSummary, 
    initSummaryEvents, 
    initSummary 
} from './summaryRenderer.js';

import { 
    initSummaryUpdateEvents 
} from './summaryUpdater.js';

/**
 * Initialize all summary functionality
 */
export function initCartSummary() {
    // Initialize summary rendering
    initSummary();
    
    // Initialize event handling for updates
    initSummaryUpdateEvents();
}

// Export all summary functions
export {
    calculateSummary,
    updateSummary,
    initSummaryEvents
}; 