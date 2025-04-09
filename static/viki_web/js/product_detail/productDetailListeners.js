/**
 * @fileoverview Main module for product detail page functionality
 * @module product_detail
 */

'use strict';

import { initImageNavigation } from './initImageNavigation.js';
import {initColorNavigation} from "./initColorNavigation.js";

document.addEventListener('DOMContentLoaded', () => {
    initImageNavigation();
    initColorNavigation();
}); 