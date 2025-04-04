/**
 * @fileoverview Module for handling product detail tab switching
 * @module product/changeDetailTab
 */

'use strict'

/**
 * Switches between product detail tabs
 * @param {Event} e - Click event on the tab button
 */
export function changeDetailTab(e) {
    const tabs = e.target.closest('.tab-btn-block');
    const tabContent = tabs.closest('.product-frame')
        .querySelector('.tab-content');
    const contents = tabContent.querySelectorAll('.tab');
    const newContent = [...contents].find( content => content.dataset.id === e.target.dataset.id);
    const tabBtn = tabs.querySelectorAll('.tab-btn');
    tabBtn.forEach(btn => {
        btn.classList.remove('tab-active');
    });
    e.target.classList.add('tab-active');
    contents.forEach(content => {
        content.classList.remove('tab-show');
    });
    newContent.classList.add('tab-show');
}