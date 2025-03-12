'use strict'

import {createDictionaryContent} from "../dictionaryElement/showDictionary/createDictionaryContent.js";

export async function createGoodsElement(className){
    const rowGrid = '14px 4fr 1fr 1.5fr 1fr 3fr 3fr 3fr 2fr 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr'
    const dictionaryContent = await createDictionaryContent(className, rowGrid, 0, 'None');
    dictionaryContent.id = className;
    dictionaryContent.dataset.grid = rowGrid;
    return dictionaryContent;
}