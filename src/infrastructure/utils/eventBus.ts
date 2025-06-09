/**
 * Simple event bus for communication between components
 */
type EventCallback = (...args: any[]) => void;

interface EventBus {
  [key: string]: EventCallback[];
}

const eventBus: EventBus = {};

/**
 * Subscribe to an event
 * @param event Event name
 * @param callback Callback function
 */
export const subscribe = (event: string, callback: EventCallback): void => {
  if (!eventBus[event]) {
    eventBus[event] = [];
  }
  eventBus[event].push(callback);
};

/**
 * Unsubscribe from an event
 * @param event Event name
 * @param callback Callback function
 */
export const unsubscribe = (event: string, callback: EventCallback): void => {
  if (eventBus[event]) {
    eventBus[event] = eventBus[event].filter(cb => cb !== callback);
  }
};

/**
 * Publish an event
 * @param event Event name
 * @param args Arguments to pass to the callback
 */
export const publish = (event: string, ...args: any[]): void => {
  if (eventBus[event]) {
    eventBus[event].forEach(callback => {
      callback(...args);
    });
  }
};

export default {
  subscribe,
  unsubscribe,
  publish
};
