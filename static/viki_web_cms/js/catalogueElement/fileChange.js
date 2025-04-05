/**
 * @fileoverview Module for handling file changes in catalogue items
 * @module catalogueElement/fileChange
 */

'use strict'

import {jsonUrl} from "../main.js";
import {fetchJsonData} from "../fetchJsonData.js";
import {createColors} from "./createColors.js";

/**
 * Handles file change event for catalogue item
 * @param {Event} e - File input change event
 * @param {HTMLElement} fileName - Element to display file name
 * @param {string} goodsId - ID of the goods item
 * @param {string} simpleArticle - Simple article number
 * @param {HTMLImageElement} photo - Image element to display the photo
 * @returns {Promise<void>}
 */
export async function fileChange(e, fileName, goodsId, simpleArticle, photo) {
    const form = e.target.closest('form');
    const itemId = form.querySelector('input[name="id"]');
    const colors = form.querySelector('input[name="colors"]');
    const option = form.querySelector('input[name="goods_option__id"]');
    const name = form.querySelector('textarea[name="name"]');
    const itemArticle = form.querySelector('input[name="item_article"]');
    const mainColorId = form.querySelector('input[name="main_color__id"]');
    const mainColorText = form.querySelector('.main_color_text');
    const goodsOptionName = form.querySelector('.goods_option__name');
    const btnSave = form.querySelector('.btn__save');

    /**
     * Clears form data and resets UI elements
     */
    function clearData() {
        fileName.textContent = '';
        photo.src = '';
        name.value = '';
        itemArticle.value = '';
        mainColorId.value = '';
        mainColorText.textContent = '';
        option.value = '';
        goodsOptionName.textContent = '';
        colors.value = '';
        btnSave.disabled = true;
        if (!btnSave.classList.contains('btn__disabled')) btnSave.classList.add('btn__disabled');
    }

    // colors.innerHTML = '';
    colors.value = ''
    option.value = '';
    const re = /(\.jpg|\.jpeg|\.png)$/i;
    if (!re.exec(e.target.value)) {
        e.target.value = '';
        clearData();
    } else {
        const newFile = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            photo.src = event.target.result;
        };
        reader.readAsDataURL(newFile);
        fileName.textContent = e.target.value.split("\\").pop();
        const fileNameText = fileName.textContent.split('.')[0];
        const url = jsonUrl + 'parse_file_data/' + goodsId +
            '/' + simpleArticle + '/' + fileNameText + '/' + itemId.value;
        const parseData = await fetchJsonData(url);
        if (!parseData.error) {
            name.value = parseData.values.name;
            itemArticle.value = parseData.values.item_article;
            mainColorId.value = parseData.values.main_color__id;
            mainColorText.textContent = parseData.values.main_color_text;
            option.value = parseData.values.goods_option__id;
            goodsOptionName.textContent = parseData.values.goods_option__name
            createColors(parseData.values.colors, colors);
            btnSave.disabled = false;
            btnSave.classList.remove('btn__disabled');
        } else {
            clearData();
        }
    }
}