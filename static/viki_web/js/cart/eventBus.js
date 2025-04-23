/**
 * Event Bus module
 * Provides publish-subscribe mechanism for communication between isolated modules
 */

class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Publish an event with data
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach((callback, index) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in handler for "${event}":`, error);
                }
            });
        }
    }
}

// Create single instance
const eventBus = new EventBus();

export default eventBus;
