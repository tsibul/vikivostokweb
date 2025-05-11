'use strict';

import {setupHeaderHandlers} from "../fullScreenElement/headerHandlers.js";
import {createOrderRow} from "./createOrderRows.js";
import {createPageContent} from "../fullScreenElement/createPageContent.js";

/**
 * Creates user element with specified grid layout
 * @param {string} className - CSS class name for the element
 * @returns {Promise<HTMLElement>} Created user element
 */
export async function createOrderElement(className) {
    const headerStyle = 'order-element__header';
    setupHeaderHandlers(createOrderRow, headerStyle, '/cms/json/order_list');
    const columns = [
        {title: 'номер'},
        {title: 'дата'},
        {title: 'от'},
        {title: 'клиент'},
        {title: 'сумма'},
        {title: 'статус'},
        {title: 'менеджер'},
        {title: 'отв.'},
        {title: 'дней'},
        {title: 'срок'},
        {title: 'макет'},
        {title: 'счет'},
        {title: 'накл.'},
        {title: 'изм.'},
        {title: ''},
    ];
    return await createPageContent('order-content', columns, headerStyle,
        createOrderRow, '/cms/json/order_list');
}


// export const orderEditOptions = {
//     'editOrder': {
//         'type': 'editOrder',
//         'fields': [
//             {
//                 'name': 'state',
//                 'label': 'статус',
//                 'type': 'list',
//                 'null': false,
//                 'changePrice':false,
//             },
//             {
//                 'name': 'days_to_deliver',
//                 'label': 'рабочих дней',
//                 'type': 'number',
//                 'null': true,
//                 'changePrice':false,
//             },
//             {
//                 'name': 'user_responsible',
//                 'label': 'ответственный',
//                 'type': 'list',
//                 'null': false,
//                 'changePrice':false,
//             },
//             {
//                 'name': 'delivery_date',
//                 'label': 'контрольный срок',
//                 'type': 'date',
//                 'null': true,
//                 'changePrice':false,
//             },
//         ]
//     },
//     'editItem': {
//         'tipe': 'editItem',
//         'fields': [
//             {
//                 'name': 'branding_name',
//                 'label': 'нанесение',
//                 'type': 'string',
//                 'null': true,
//                 'changePrice':false,
//             },
//             {
//                 'name': 'price',
//                 'label': 'нанесение',
//                 'type': 'float',
//                 'null': false,
//                 'changePrice': true,
//             },
//         ]
//     },
//     'editBranding': {
//         'type': 'editBranding',
//         'fields': [
//             {
//                 'name': 'print_type',
//                 'label': 'тип нанесения',
//                 'type': 'list',
//                 'null': false,
//                 'changePrice':true,
//             },
//             {
//                 'name': 'print_place',
//                 'label': 'место нанесения',
//                 'type': 'list',
//                 'null': false,
//                 'changePrice': true,
//             },
//             {
//                 'name': 'colors',
//                 'label': 'кол-во цветов',
//                 'type': 'list',
//                 'null': false,
//                 'changePrice':true,
//             },
//             {
//                 'name': 'second_pass',
//                 'label': 'второй проход',
//                 'type': 'boolean',
//                 'changePrice':true,
//             },
//         ]
//     },
//     'editDelivery': {
//         'type': 'editDelivery',
//         'fields':[
//             {
//                 'name': 'name',
//                 'label': 'опция доставки',
//                 'type': 'list',
//                 'null': false,
//                 'changePrice': true,
//             },
//         ]
//     },
// }


