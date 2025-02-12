'use strict'

import {createHeader} from "../dictionaryElement/showDictionary/createHeader.js";
import {cmsPages} from "../main.js";

export async function createFullScreenContent(content, menuCode, pageName) {
        content.style.flexDirection = 'column';
        const menuContent = JSON.parse(menuCode)[0];
        const headingTitle = menuContent.cms_settings[0].setting;
        const className = menuContent.cms_settings[0].setting_class;
        const upload = menuContent.cms_settings[0].upload;
        const header = createHeader(className, headingTitle, upload);
        content.appendChild(header);
        const pageContent = await cmsPages[pageName](className);
        content.appendChild(pageContent);
}