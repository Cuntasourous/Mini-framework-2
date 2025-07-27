export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = new Set();
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update state
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    }

    // Subscribe to state changes
    subscribe(handler) {
        this.subscribers.add(handler);
        return () => this.subscribers.delete(handler);
    }

    // Notify all subscribers of state change
    notifySubscribers() {
        this.subscribers.forEach(handler => handler(this.state));
    }

    // Dispatch an action
    dispatch(action) {
        if (typeof action === 'function') {
            action(this.dispatch.bind(this), this.getState.bind(this));
        } else {
            this.setState(action);
        }
    }
} 

