/**
 * @fileoverview Module for implementing drag and drop functionality for modal windows
 * @module common/modalDnD
 */

'use strict'

/**
 * Implements drag and drop functionality for modal windows
 * @param {HTMLElement} modal - Modal window element to make draggable
 */
export function modalDnD(modal) {
    let offsetX, offsetY, isDragging = false;
    const modalHeader = modal.querySelector('.login__title');
    modalHeader.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;
        modal.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            modal.style.left = `${event.clientX - offsetX}px`;
            modal.style.top = `${event.clientY - offsetY}px`;
        }
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        modal.style.cursor = "grab";
    });
}