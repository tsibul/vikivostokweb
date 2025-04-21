/**
 * Main cart module - exports all cart functionality
 */

import { renderCart } from './rendering.js';
import { initCartQuantity } from './quantity.js';
import { initCartItemRemove } from './remove.js';
import { updateItemTotal, updateBrandingPrices, updateItemFinalTotal } from './calculation.js';
import { updateCartSummary } from './summary.js';
import { formatPrice } from './utils.js';
import { printOpportunitiesCache, getBrandingCountByTypeAndPlace } from './brandingCommon.js';
import { 
    initBranding, 
    attachAddBrandingHandlers, 
    updateAllLocationOptionsInContainer,
    updateLocationOptions,
    updateColorsOptions,
    fetchPrintOpportunities,
    initDropdowns
} from './branding.js';
import {
    createBrandingItem,
    checkAndUpdateAddBrandingButton,
    updateCartBrandingInLocalStorage
} from './brandingHelpers.js';
import { updateBrandingItem } from './brandingItem.js';
import { initPriceManager } from './priceManager.js';

export { 
    renderCart, 
    initCartQuantity, 
    initCartItemRemove, 
    initBranding,
    initDropdowns,
    initPriceManager,
    printOpportunitiesCache
}; 