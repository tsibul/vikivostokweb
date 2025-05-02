/**
 * @fileoverview Module for fetching user data from backend
 * @module userElement/getUserData
 */

'use strict';

import {fetchJsonData} from '../fetchJsonData.js';

/**
 * Fetches user data from backend with filtering options
 * @param {number} lastRecord - Last record number for pagination
 * @param {string} searchString - Search string to filter users
 * @param {boolean} newOnly - Whether to show only new users
 * @returns {Promise<Object>} User data and last record number
 */
export async function getUserExtensionData(lastRecord = 0, searchString = '', newOnly = false) {
    try {
        // Prepare query parameters
        const params = new URLSearchParams({
            last_record: lastRecord,
        });

        if (searchString) {
            params.append('search', searchString);
        }

        if (newOnly) {
            params.append('new', '1');
        }

        return await fetchJsonData(`/cms/json/user_extension?${params.toString()}`);
    } catch
        (error) {
        console.error('Failed to fetch user data:', error);
        return {userList: [], last_record: lastRecord};
    }
} 