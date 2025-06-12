'use strict';

import {getCSRFToken} from "../getCSRFToken.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createModalInput} from "../dictionaryElement/createInput/createModalInput.js";
import {createDropDown} from "../dropDown/createDropDown.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {closeModal} from "../modalFunction/closeModal.js";

export async function chooseCompanyToAdd(customerId) {
    // const companyList = await response.json();
    // const formData = new FormData;
    // formData.append('customer_id', customerId);
    // const response = await fetch('/cms/json/company_list', {
    //     method: "POST",
    //     headers: {
    //         "X-CSRFToken": getCSRFToken(),
    //     },
    //     body: formData
    // });
    // if (companyList) {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    dialog.classList.add('files-element__modal');

    const dropdown = await createDropDown('Company' );
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
    // button.addEventListener('click', async () => {
    //     await chooseCompanyToAdd(customer.id)
    // });
    btnBlock.appendChild(button);
    dialog.appendChild(btnBlock);
    dialog.showModal()


    // }
}

export function addCompanyToGroup(companyId, customerId) {

}