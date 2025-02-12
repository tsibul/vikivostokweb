'use strict'

import {createDictionaryContent} from "../dictionaryElement/showDictionary/createDictionaryContent.js";

export async function createGoodsElement(className){
    const rowGrid = '14px 4fr 1fr 2fr 3fr 3fr 3fr 3fr 3fr 1fr 1fr 3fr 1fr'
    return await createDictionaryContent(className, rowGrid, 0, 'None');
}