'use strict';

import {bankHtml, companyHtml} from "./companyHtml.js";
import {startLegalEdit} from "./startLegalEdit.js";
import {cancelLegalEdit} from "./cancelLegalEdit.js";
import {dataLegalSave} from "./dataLegalSave.js";

export function createLegalData(data, section) {
    if (data.length) {
        data.forEach(company => {
            const companyCode = companyHtml.replaceAll('-0', '-' + company.id);
            section.insertAdjacentHTML('beforeend', companyCode);
            const companyBlock = section.lastElementChild;
            const line = document.createElement('hr');
            companyBlock.insertAdjacentElement('beforebegin', line);
            line.classList.add('hr');
            const blockInputs = companyBlock.querySelectorAll('input');
            [...blockInputs].forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = company[input.dataset.name];
                } else {
                    input.value = company[input.dataset.name]
                }
            });
            companyBlock.querySelector('button.btn__neutral').addEventListener('click', () => {
                startLegalEdit(companyBlock);
            });
            companyBlock.querySelector('button.btn__cancel').addEventListener('click', () => {
                cancelLegalEdit(company, companyBlock);
            });
            companyBlock.querySelector('button.btn__save').addEventListener('click', async () => {
                await dataLegalSave(companyBlock, 'company');
            })
            const bankTitle = companyBlock.querySelector(`#company-bank-${company.id}`);
            if (company.bank.length) {
                company.bank.forEach(bank => {
                    const bankCode = bankHtml.replaceAll('-0', '-' + bank.id);
                    bankTitle.insertAdjacentHTML('beforeend', bankCode);
                    const bankBlock = bankTitle.lastElementChild;
                    bankBlock.querySelector('button.btn__neutral').addEventListener('click', () => {
                        startLegalEdit(bankBlock);
                    });
                    bankBlock.querySelector('button.btn__cancel').addEventListener('click', () => {
                        cancelLegalEdit(bank, bankBlock);
                    });
                    bankBlock.querySelector('button.btn__save').addEventListener('click', async () => {
                        await dataLegalSave(bankBlock, 'bank');
                    });
                    const bankInputs = bankBlock.querySelectorAll('input');
                    [...bankInputs].forEach(input => {
                        input.value = bank[input.dataset.name]
                    });
                });
            }
        });
    }

}