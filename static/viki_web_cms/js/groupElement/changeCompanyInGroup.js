'use strict';

import {getCSRFToken} from "../getCSRFToken.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createModalInput} from "../dictionaryElement/createInput/createModalInput.js";
import {createDropDown} from "../dropDown/createDropDown.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {closeModal} from "../modalFunction/closeModal.js";

export async function chooseCompanyToAdd(customerId) {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    dialog.classList.add('files-element__modal');

    const dropdown = await createDropDown('Company');
    dialog.appendChild(dropdown)

    const btnBlock = document.createElement('div');
    btnBlock.classList.add('files-element__btn-block')
    const btnCancel = createCancelButton('Закрыть');
    btnCancel.addEventListener('click', async () => {
        closeModal(dialog);
    });
    btnBlock.appendChild(btnCancel);
    const button = createSaveButton('Добавить');
    button.dataset.id = customerId;
    button.addEventListener('click', async () => {
        const companyId = dropdown.querySelector(`input[hidden]`).value;
        await addCompanyToGroup(companyId, customerId)
        closeModal(dialog);
    });
    btnBlock.appendChild(button);
    dialog.appendChild(btnBlock);
    dialog.showModal()

}

/**
 *
 * @param {string} companyId
 * @param {string} customerId
 * @returns {Promise<void>}
 */
export async function addCompanyToGroup(companyId, customerId) {
    const formData = new FormData;
    formData.append('company_id', companyId);
    formData.append('customer_id', customerId);
    const response = await fetch('/cms/json/company_change_customer', {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        body: formData
    });
    const data = await response.json();
    if (data.changed) {
        const companyRow = document.querySelector(`div.group-element__item[data-id="${data.companyId}"]`);
        const newCompanyRow = companyRow.cloneNode(true);
        companyRow.remove();
        const customerSummary = document.querySelector(`summary[data-id="${data.newCustomerId}"]`);
        const customerDetails = customerSummary.closest('details');
        customerDetails.appendChild(newCompanyRow);
        const summaryItems = customerSummary.querySelectorAll('div.dictionary-content__row');
        if (data.oldCustomerId) {
            const oldCustomerDetails = document.querySelector(`summary[data-id="${data.oldCustomerId}"]`)
                .closest('details');
            oldCustomerDetails.remove();
        }
    }
}