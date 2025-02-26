'use strict'

import {createCatalogueItem} from "./createCatalogueItem.js";

/**
 * create inputs to save additional colors for item
 * @param item
 * @param colors
 */
export function createColors(item, colors) {
    item.forEach(color => {
        let counter = 1;
        let position;
        counter++;
        colors.appendChild(createCatalogueItem('number', counter + '_color__id', color.color__id))
        position = createCatalogueItem('number', counter + '_color_position', color.color_position);
        position.hidden = true;
        colors.appendChild(position);
    });
}
