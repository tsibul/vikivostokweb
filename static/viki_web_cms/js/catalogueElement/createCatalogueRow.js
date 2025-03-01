'use strict'

import {createDropDown} from "../dropDown/createDropDown.js";
import {createSaveButton} from "../createStandardElements/createSaveButton.js";
import {createCancelButton} from "../createStandardElements/createCancelButton.js";
import {createCatalogueItem} from "./createCatalogueItem.js";
import {createColors} from "./createColors.js";
import {fileChange} from "./fileChange.js";
import {cancelEdit} from "./cancelEdit.js";
import {fieldNotFileChange} from "./fieldNotFileChange.js";
import {deletedChange} from "./deletedChange.js";
import {saveCatalogueItem} from "./saveCatalogueItem.js";

/**
 *
 * @param item
 * @param catalogueRow
 * @returns {Promise<void>}
 */
export async function createCatalogueRow(item, catalogueRow) {
    catalogueRow.enctype = 'multipart/form-data';
    catalogueRow.classList.add('catalogue', 'catalogue__row');
    catalogueRow.appendChild(createCatalogueItem('number', 'id', item.id));
    const deleted = createCatalogueItem('checkbox', 'deleted', item.deleted);
    deleted.addEventListener('change', (e) => deletedChange(e));
    catalogueRow.appendChild(deleted);
    const itemName = document.createElement('textarea');
    itemName.value = item.name;
    itemName.name = 'name'
    itemName.classList.add('catalogue__input');
    itemName.readOnly = true;
    catalogueRow.appendChild(itemName);
    catalogueRow.appendChild(createCatalogueItem('text', 'item_article', item.item_article));
    const mainColor = document.createElement('div');
    mainColor.classList.add('catalogue__input', 'main_color_text');
    mainColor.textContent = item.main_color_text;
    catalogueRow.appendChild(mainColor)
    catalogueRow.appendChild(createCatalogueItem('text', 'main_color__id', item.main_color__id));
    catalogueRow.appendChild(createCatalogueItem('number', 'goods_option__id', item.goods_option__id));
    const optionName = document.createElement('div');
    optionName.classList.add('catalogue__input', 'goods_option__name');
    optionName.textContent = item.goods_option__name;
    catalogueRow.appendChild(optionName);
    const photo = document.createElement('img');
    photo.classList.add('catalogue__img');
    photo.alt = item.item_article;
    photo.src = '/static/viki_web_cms/files/item_photo/' + item.image;
    catalogueRow.appendChild(photo)
    const simpleArticle = createCatalogueItem('checkbox', 'simple_article', item.simple_article);
    if (item.id === 0) {
        simpleArticle.checked = true;
    }
    simpleArticle.addEventListener('change', (e) => fieldNotFileChange(e));
    catalogueRow.appendChild(simpleArticle);
    const goodsField = await createDropDown('Goods', item.goods__id, false)
    catalogueRow.appendChild(goodsField);
    const goodsId = goodsField.querySelector('input[hidden]');
    goodsId.name = 'goods__id';
    goodsId.addEventListener('change', (e) => fieldNotFileChange(e));
    const file = document.createElement('div');
    file.classList.add('catalogue__file');
    const fileName = document.createElement('div');
    fileName.textContent = item.image;
    fileName.classList.add('catalogue__file_text');
    file.appendChild(fileName);
    const inputFrame = document.createElement('div');
    inputFrame.classList.add('catalogue__input-frame');
    const fileInput = document.createElement('input');
    fileInput.classList.add('catalogue__file_input');
    fileInput.type = 'file';
    fileInput.name = 'image';
    fileInput.accept = 'image/png, image/jpeg, image/jpg';
    fileInput.addEventListener('change', async (e) =>
        await fileChange(e, fileName, goodsId.value, simpleArticle.checked ? 1 : 0, photo)
    );
    inputFrame.appendChild(fileInput)
    file.appendChild(inputFrame);
    catalogueRow.appendChild(file);
    const btnBlock = document.createElement('div');
    btnBlock.classList.add('catalogue__btn-block');
    const saveBtn = createSaveButton('');
    saveBtn.disabled = true;
    saveBtn.classList.add('tooltip', 'btn__disabled');
    saveBtn.innerHTML = '<i class="catalogue__icon fa-solid fa-check"></i>' +
        '<span class="tooltip-text">сохранить</span>';
    saveBtn.addEventListener('click', (e) => saveCatalogueItem(e, saveBtn));
    const cancelBtn = createCancelButton('');
    cancelBtn.classList.add('tooltip', 'btn__disabled');
    cancelBtn.disabled = true;
    cancelBtn.innerHTML = '<i class="catalogue__icon fa-solid fa-x"></i>' +
        '<span class="tooltip-text">отменить</span>';
    cancelBtn.addEventListener('click', (e) => cancelEdit(e));
    btnBlock.appendChild(saveBtn);
    btnBlock.appendChild(cancelBtn);
    catalogueRow.appendChild(btnBlock);
    // const colors = document.createElement('div');
    const colors = createCatalogueItem('text', 'colors', '');
    colors.hidden = true;
    // colors.classList.add('colors');
    catalogueRow.appendChild(colors)
    if (item.colors) {
        createColors(item.colors, colors);
    }
}