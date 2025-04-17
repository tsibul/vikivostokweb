'use strict';

/**
 * Save viewed goods in LocalStorage
 * @param {string} id - goods id
 * @param {string} data - goods full data
 */
export function saveRecentlyViewed(id, data) {
    // Obtain recently viewed goods
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

    // Current date in timestamp
    const currentDate = Date.now();

    // Check if goods in list
    const existingItemIndex = recentlyViewed.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
        // if goods exist renew date
        recentlyViewed[existingItemIndex].date = currentDate;
    } else {
        // else add new goods
        recentlyViewed.push({
            id: id,
            data: data,
            date: currentDate
        });

        // if list length more than 4 delete oldest
        if (recentlyViewed.length > 4) {
            // sort from old to new
            recentlyViewed.sort((a, b) => a.date - b.date);
            // delete first (oldest)
            recentlyViewed.shift();
        }
    }

    // save list to LocalStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}
