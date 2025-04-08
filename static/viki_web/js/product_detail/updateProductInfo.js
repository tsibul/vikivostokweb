/**
 * Updates product information based on image data
 * @param {HTMLImageElement} image - Image with product data
 */
export function updateProductInfo(image) {
    const article = image.dataset.article;
    let price = '';

    // Check for price and select the appropriate one
    if (image.dataset.price && image.dataset.price !== 'None' && image.dataset.price !== 'undefined' && image.dataset.price !== '') {
        price = image.dataset.price;
    } else if (image.dataset.goodsPrice && image.dataset.goodsPrice !== 'None' && image.dataset.goodsPrice !== 'undefined' && image.dataset.goodsPrice !== '') {
        price = image.dataset.goodsPrice;
    } else {
        price = '0'; // Default value if no price is found
    }

    const colorDescription = image.dataset.colorDescription;

    // Update article number
    const articleElement = document.querySelector('.detail-page__article h3:first-child');
    if (articleElement) {
        articleElement.textContent = `Артикул: ${article}`;
    }

    // Update price
    const priceElement = document.querySelector('.detail-page__article h3.strong');
    if (priceElement) {
        priceElement.textContent = `Цена: ${price} руб.`;
    }

    // Update color description
    const colorDescriptionContainer = document.querySelector('.detail-page__color-description');
    colorDescriptionContainer.textContent = colorDescription;
} 