/**
 * @fileoverview Module for fetching user data from backend
 * @module userElement/getUserData
 */

'use strict';

import {fetchJsonData} from '../fetchJsonData.js';

export async function getUserExtensionData(lastRecord = 0, searchString = '', newOnly = false) {
    try {
        const params = new URLSearchParams({
            last_record: lastRecord,
        });

        if (searchString) {
            params.append('search', searchString);
        }

        if (newOnly) {
            params.append('new', '1');
        }

        const response = await fetchJsonData(`/cms/json/user_extension?${params.toString()}`);
        
        if (!response || typeof response !== 'object') {
            return {dataList: [], last_record: lastRecord};
        }
        
        if (!Array.isArray(response.dataList)) {
            response.dataList = [];
        }
        
        return response;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return {dataList: [], last_record: lastRecord};
    }
} 