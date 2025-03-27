'use strict'

import {createSaveButton} from "../createStandardElements/createSaveButton.js";

export function loadCsvAlert(rowData) {
    const alert = document.createElement('dialog')
    alert.classList.add('alert');
    const header = document.createElement('header');
    header.classList.add('modal__header');
    const title = document.createElement('h4');
    title.textContent = 'Результат загрузки';
    header.appendChild(title);
    const close = document.createElement('div');
    close.innerHTML = '&times;';
    close.addEventListener('click', () => {
        alert.remove();
    })
    header.appendChild(close);
    alert.appendChild(header);
    const errors = alertDetails();
    const errorSummary = alertSummary('Ошибки', rowData.recordErrorLength)
    errors.appendChild(errorSummary)
    rowData.recordError.forEach(record => {
        errors.appendChild(alertElement(record));
    });
    alert.appendChild(errors);
    const doubles = alertDetails();
    const doubleSummary = alertSummary('Дубли', rowData.recordDoubleLength)
    doubles.appendChild(doubleSummary)
    rowData.recordDouble.forEach(record => {
        doubles.appendChild(alertElement(record));
    });
    alert.appendChild(doubles);
    const success = alertDetails();
    const successSummary = alertSummary('Успешно', rowData.recordSuccessLength)
    success.appendChild(successSummary)
    rowData.recordSuccess.forEach(record => {
        success.appendChild(alertElement(record));
    });
    alert.appendChild(success);
    const btn = createSaveButton('Ok');
    btn.classList.add('alert__btn');
    btn.addEventListener('click', () => {
        alert.remove();
    })
    alert.appendChild(btn);
    return alert;
}

function alertDetails() {
    const details = document.createElement('details');
    details.classList.add('alert__details');
    return details;
}

function alertSummary(text, number) {
    const summary = document.createElement('summary');
    summary.classList.add('alert__summary');
    summary.textContent = text + ' ' + number;
    return summary;
}

function alertElement(item){
    const element = document.createElement('div');
    element.classList.add('alert__element');
    const articleLabel = document.createElement('div');
    articleLabel.textContent = 'артикул';
    const article = document.createElement('div');
    article.textContent = item.item;
    const resultLabel = document.createElement('div');
    resultLabel.textContent = 'результат';
    const result = document.createElement('div');
    result.textContent = item.message;
    element.appendChild(articleLabel);
    element.appendChild(article);
    element.appendChild(resultLabel)
    element.appendChild(result);
    return element;
}