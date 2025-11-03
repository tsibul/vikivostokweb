/**
 * @fileoverview Module for initializing and loading user's cabinet data
 * @module cabinet/fullDataInitial
 */

'use strict';

import {fillInputsWithData} from "./fillInputsWithData.js";
import {fetchJsonData} from "../common/fetchJsonData.js";
import {createLegalData} from "./createLegalData.js";

/**
 * Initializes and loads all user's cabinet data including personal and legal information
 * @param {HTMLElement} personalData - Container element for personal data
 * @param {HTMLElement} legalData - Container element for legal data
 * @returns {Promise<Object>} Object containing all user's data
 */
export async function fullDataInitial(personalData, legalData) {
    const data = await fetchJsonData('/cabinet_data/')
    if (data.status === 'ok') {
        fillInputsWithData(data.data['personalData'], personalData);
        createLegalData(data.data['legalData'], legalData);
    }
    return data.data;
}