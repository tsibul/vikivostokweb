'use strict'

/**
 * create editable fields for modal
 * @param modal
 * @param className
 * @param elementId
 * @returns {Promise<HTMLDivElement>}
 */
export async function createModalContent(modal, className, elementId) {
    const modalContent = document.createElement("div");
    modalContent.classList.add('modal__content');
    return modalContent;
}