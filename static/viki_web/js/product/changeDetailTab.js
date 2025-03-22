'use strict'

export function changeDetailTab(e) {
    const tabs = e.target.closest('.product-hor__tab-btn-block');
    const tabContent = tabs.closest('.product-frame')
        .querySelector('.product-hor__tab-content');
    const contents = tabContent.querySelectorAll('.product-hor__tab');
    const newContent = [...contents].find( content => content.dataset.id === e.target.dataset.id);
    const tabBtn = tabs.querySelectorAll('.product-hor__tab-btn');
    tabBtn.forEach(btn => {
        btn.classList.remove('tab-active');
    });
    e.target.classList.add('tab-active');
    contents.forEach(content => {
        content.classList.remove('tab-show');
    });
    newContent.classList.add('tab-show');
}