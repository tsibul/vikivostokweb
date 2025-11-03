/**
 * Product Extractor Module
 * Extracts product data from DOM elements
 */

/**
 * Extract product data from DOM element
 * Handles different types of product layouts
 * @param {HTMLElement} element - Element to extract data from (usually the clicked button)
 * @returns {Object|null} - Product data or null if extraction failed
 */
export function extractProductData(element) {
    try {
        // Find closest product container from one of the supported layouts
        const productContainer = element.closest('.product, .detail-page__content, .recently-viewed__item');
        if (!productContainer) {
            console.error('Product container not found');
            return null;
        }

        // Initialize empty product data
        let productData = {
            quantity: 1, // Default quantity
            branding: [] // Empty branding array
        };

        // Extract data based on container type
        if (productContainer.classList.contains('recently-viewed__item')) {
            return extractRecentlyViewedProductData(productContainer, productData);
        } else if (productContainer.querySelector('.detail-page__main-image')) {
            return extractDetailPageProductData(productContainer, productData);
        } else {
            return extractCatalogProductData(productContainer, productData);
        }
    } catch (error) {
        console.error('Error extracting product data:', error);
        return null;
    }
}

/**
 * Extract product data from recently viewed container
 * @param {HTMLElement} container - Recently viewed container
 * @param {Object} productData - Partial product data
 * @returns {Object} - Complete product data
 */
function extractRecentlyViewedProductData(container, productData) {
    // Get the active image (not hidden)
    const activeImage = container.querySelector('img:not(.item-hidden)');
    if (!activeImage) {
        throw new Error('Active image not found in recently viewed item');
    }

    // Get the selected color square (with outline)
    const selectedColorSquare = container.querySelector('.square[style*="outline: 1px solid"]');
    const colorDescription = selectedColorSquare ? 
        selectedColorSquare.querySelector('.tooltip-text')?.textContent.trim() : '';

    // Extract basic information
    return {
        ...productData,
        id: activeImage.dataset.id, // ID текущего цвета/варианта
        goodsId: container.dataset.id,
        name: container.querySelector('.recently-viewed__name')?.textContent.trim() || '',
        article: container.querySelector('.recently-viewed__article')?.textContent.trim()
            .replace('Артикул:', '').trim() || '',
        price: parseFloat(container.querySelector('.recently-viewed__price')?.textContent.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        image: activeImage.src || '/static/viki_web/icons/logo.svg',
        description: container.querySelector('.recently-viewed__description')?.textContent.trim() || colorDescription || '',
        colorDescription: colorDescription
    };
}

/**
 * Extract product data from detail page container
 * @param {HTMLElement} container - Detail page container
 * @param {Object} productData - Partial product data
 * @returns {Object} - Complete product data
 */
function extractDetailPageProductData(container, productData) {
    // Get the active image (not hidden)
    const activeImage = container.querySelector('.detail-page__main-image img:not(.item-hidden)');
    if (!activeImage) {
        throw new Error('Active image not found in detail page');
    }

    // Extract data
    return {
        ...productData,
        id: activeImage.dataset.id,
        goodsId: container.dataset.id,
        name: container.querySelector('h1, h2, h3')?.textContent.trim() || '',
        article: activeImage.dataset.article || '',
        price: parseFloat(activeImage.dataset.price) || 0,
        image: activeImage.src || '/static/viki_web/icons/logo.svg',
        description: activeImage.dataset.description || container.querySelector('.detail-page__color-description')?.textContent.trim() || ''
    };
}

/**
 * Extract product data from catalog container
 * @param {HTMLElement} container - Catalog product container
 * @param {Object} productData - Partial product data
 * @returns {Object} - Complete product data
 */
function extractCatalogProductData(container, productData) {
    // Get the active image frame (not hidden)
    const activeImageFrame = container.querySelector('.product-hor__image-frame:not(.item-hidden), .product-sqr__image-frame:not(.item-hidden)');
    if (!activeImageFrame) {
        throw new Error('Active image frame not found in catalog product');
    }

    // Get image element
    const imageElement = activeImageFrame.querySelector('img') || activeImageFrame;

    // Extract data
    return {
        ...productData,
        id: activeImageFrame.dataset.id,
        goodsId: container.dataset.id,
        name: container.querySelector('h3')?.textContent.trim() || '',
        article: activeImageFrame.dataset.article || '',
        price: parseFloat(activeImageFrame.dataset.price) || 0,
        image: imageElement.tagName === 'IMG' ? imageElement.src : '/static/viki_web/icons/logo.svg',
        description: activeImageFrame.dataset.description || container.querySelector('.product-hor__color-description')?.textContent.trim() || ''
    };
} 