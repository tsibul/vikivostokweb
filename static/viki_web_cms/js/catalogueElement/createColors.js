/**
 * @fileoverview Module for handling color data in catalogue items
 * @module catalogueElement/createColors
 */

'use strict'

import {createCatalogueItem} from "./createCatalogueItem.js";

/**
 * Creates and manages color data for catalogue items
 * @param {Array<Object>} item - Array of color data objects
 * @param {HTMLInputElement} colors - Input element to store color data
 */
export function createColors(item, colors) {
    // item.forEach(color => {
    //     let counter = 1;
    //     let position;
    //     counter++;
    //     colors.appendChild(createCatalogueItem('number', counter + '_color__id', color.color__id))
    //     position = createCatalogueItem('number', counter + '_color_position', color.color_position);
    //     position.hidden = true;
    //     colors.appendChild(position);
    // });
    colors.value = JSON.stringify(item);
}
