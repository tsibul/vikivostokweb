'use strict'

export function createInputModal(element) {
    const dictionaryContent = element.closest('.dictionary-content');
    const dictionaryHeader = dictionaryContent
        .parentElement.querySelector('.dictionary-frame__header');
    const dictionaryClass = dictionaryHeader.dataset.class;
    const dictionaryTitle = dictionaryHeader.dataset.title;
    console.log();
}