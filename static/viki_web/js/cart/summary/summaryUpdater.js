/**
 * Summary Updater Module
 * Handles updating the cart summary when cart items change
 */

import eventBus from '../eventBus.js';
import { STORAGE_EVENTS } from '../cartStorage.js';
import { updateSummary } from './summaryRenderer.js';

/**
 * Initialize summary update events
 * Subscribes to all cart update events to refresh the summary
 */
export function initSummaryUpdateEvents() {
    // Subscribe to all relevant cart events
    eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_ADDED, updateSummary);
    eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_REMOVED, updateSummary);
    eventBus.subscribe(STORAGE_EVENTS.CART_ITEM_UPDATED, updateSummary);
    
    console.log('Summary update events initialized');
}
