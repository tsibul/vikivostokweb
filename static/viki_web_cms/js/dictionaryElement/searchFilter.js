'use strict'

export async function searchFilter(button, className) {
    const dictionarySection = button.closest('.dictionary-frame');
    const searchString = dictionarySection.querySelector('.dictionary-frame__input').textContent;
    const deletedCheck = dictionarySection.querySelector('.check');


}