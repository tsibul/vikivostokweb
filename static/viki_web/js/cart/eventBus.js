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
            console.log(`DEBUG-BUS: Creating new event handler array for "${event}"`);
        } else {
            console.log(`DEBUG-BUS: Adding to existing event handlers for "${event}", current count: ${this.events[event].length}`);
        }
        
        this.events[event].push(callback);
        console.log(`DEBUG-BUS: Subscribed to "${event}", total handlers: ${this.events[event].length}`);
        
        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
            console.log(`DEBUG-BUS: Unsubscribed from "${event}", remaining handlers: ${this.events[event].length}`);
        };
    }

    /**
     * Publish an event with data
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    publish(event, data) {
        console.log(`DEBUG-BUS: Publishing event "${event}" with data:`, data);
        
        if (this.events[event]) {
            console.log(`DEBUG-BUS: Found ${this.events[event].length} handlers for "${event}"`);
            this.events[event].forEach((callback, index) => {
                console.log(`DEBUG-BUS: Calling handler #${index+1} for "${event}"`);
                try {
                    callback(data);
                    console.log(`DEBUG-BUS: Handler #${index+1} for "${event}" completed successfully`);
                } catch (error) {
                    console.error(`DEBUG-BUS: Error in handler #${index+1} for "${event}":`, error);
                }
            });
        } else {
            console.warn(`DEBUG-BUS: No handlers registered for event "${event}"`);
        }
    }
}

// Create single instance
const eventBus = new EventBus();

export default eventBus;
