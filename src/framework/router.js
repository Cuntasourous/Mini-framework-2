export class Router {
    constructor(routes = {}) {
        this.routes = routes;
        this.currentRoute = null;
        this.handlers = new Set();

        // Handle browser back/forward
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }

    // Add a new route
    addRoute(path, component) {
        this.routes[path] = component;
        return this;
    }

    // Navigate to a new route
    navigate(path) {
        window.history.pushState(null, '', path);
        this.handleRoute();
    }

    // Handle route changes
    handleRoute() {
        const path = window.location.pathname;
        const component = this.routes[path] || this.routes['*'];
        
        if (component) {
            this.currentRoute = component;
            this.notifyHandlers();
        }
    }

    // Subscribe to route changes
    subscribe(handler) {
        this.handlers.add(handler);
        return () => this.handlers.delete(handler);
    }

    // Notify all subscribers of route change
    notifyHandlers() {
        this.handlers.forEach(handler => handler(this.currentRoute));
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
} 
