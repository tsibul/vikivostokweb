'use strict';

import {dataInitial} from "./cabinet/dataInitial.js";
import {allInputDisabled} from "./cabinet/allInputDisabled.js";
import {editBtnListeners} from "./cabinet/editBtnListeners.js";

const personalData = document.querySelector('#personal-data');

document.querySelector('li.log-logout').style.display='none'
allInputDisabled();

const personalDataInitial = await dataInitial(personalData);
await editBtnListeners(personalData, personalDataInitial, '#first-name')

