/**
 * @fileoverview Module for handling product detail page functionality
 * @module product_detail
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const productSection = document.querySelector('.product-detail__section');
    if (!productSection) return;

    // Handle color selection
    const colorLabels = productSection.querySelectorAll('.color-label');
    colorLabels.forEach(label => {
        label.addEventListener('click', () => {
            const itemId = label.dataset.itemId;
            const frames = productSection.querySelectorAll('.product-detail__frame');
            
            frames.forEach(frame => {
                if (frame.dataset.id === itemId) {
                    frame.classList.remove('item-hidden', 'item-opaque');
                } else {
                    frame.classList.add('item-hidden', 'item-opaque');
                }
            });
        });
    });

    // Handle thumbnail clicks
    const thumbnails = productSection.querySelectorAll('.product-detail__thumbnail');
    const mainImage = productSection.querySelector('.product-detail__main-image img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const imgSrc = thumb.querySelector('img').src;
            mainImage.src = imgSrc;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Handle "Add to cart" button
    const addToCartBtn = productSection.querySelector('.btn__save');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const frame = addToCartBtn.closest('.product-detail__frame');
            const itemId = frame.dataset.id;
            const goodsId = frame.dataset.goods;
            const article = frame.dataset.article;
            const price = frame.dataset.price;
            
            // Add to cart logic here
            console.log('Adding to cart:', { itemId, goodsId, article, price });
        });
    }
}); 