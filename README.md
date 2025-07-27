
# Mini Framework

>A lightweight JavaScript framework for building modern web apps with a focus on simplicity, modularity, and control inversion. It provides DOM abstraction, routing, state management, and event handling—all without relying on any high-level frameworks or libraries.

---

## Features Overview

- **Virtual DOM Abstraction**: Efficiently updates the real DOM using a virtual DOM diffing algorithm.
- **Routing System**: Synchronizes the app state with the URL using the History API.
- **State Management**: Centralized, reactive state store with support for actions and reducers.
- **Event Handling**: Custom event bus for decoupled communication between components.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts & Usage](#core-concepts--usage)
  - [Creating Elements](#creating-elements)
  - [Nesting Elements](#nesting-elements)
  - [Adding Attributes](#adding-attributes)
  - [Event Handling](#event-handling)
  - [Routing](#routing)
  - [State Management](#state-management)
- [How the Framework Works](#how-the-framework-works)
- [TodoMVC Example](#todomvc-example)

---

## Installation

```bash
npm install
```

---

## Quick Start

Import the framework modules in your app:

```javascript
import { createElement, render } from './framework/dom.js';
import { Store } from './framework/store.js';
import { Router } from './framework/router.js';
import { EventBus } from './framework/events.js';
```

---

## Core Concepts & Usage

### Creating Elements

Use `createElement(tag, attrs, ...children)` to create virtual DOM nodes:

```javascript
import { createElement } from './framework/dom.js';

// Create a simple div
const div = createElement('div', { class: 'container' }, 'Hello World');
```

### Nesting Elements

You can nest elements by passing other `createElement` calls as children:

```javascript
const form = createElement('form', { class: 'login-form' },
    createElement('input', { type: 'text', placeholder: 'Username' }),
    createElement('input', { type: 'password', placeholder: 'Password' }),
    createElement('button', { type: 'submit' }, 'Login')
);
```

### Adding Attributes

Attributes are passed as the second argument (an object) to `createElement`. You can add any valid HTML attribute, including `class`, `id`, `type`, etc.:

```javascript
const input = createElement('input', {
    id: 'username',
    class: 'input-field',
    type: 'text',
    placeholder: 'Enter username'
});
```

### Event Handling

You can add events by using `on<EventName>` attributes (e.g., `onclick`, `onchange`). These are automatically attached as event listeners:

```javascript
const button = createElement('button', {
    onclick: () => alert('Clicked!'),
    class: 'btn'
}, 'Click Me');
```

#### Custom Event Bus

For decoupled communication, use the `EventBus`:

```javascript
import { EventBus } from './framework/events.js';
const eventBus = new EventBus();

// Subscribe to an event
eventBus.on('userLogin', (userData) => {
    console.log('User logged in:', userData);
});

// Emit an event
eventBus.emit('userLogin', { username: 'john' });
```

---

### Routing

The `Router` synchronizes the app state with the URL and notifies subscribers on route changes:

```javascript
import { Router } from './framework/router.js';

const router = new Router({
    '/': HomeComponent,
    '/about': AboutComponent,
    '*': NotFoundComponent
});

// Navigate programmatically
router.navigate('/about');

// Subscribe to route changes
router.subscribe(component => {
    // Handle route change
});
```

---

### State Management

The `Store` provides a centralized state and supports both direct updates and action functions:

```javascript
import { Store } from './framework/store.js';

const store = new Store({ count: 0 });

// Subscribe to state changes
store.subscribe(state => {
    console.log('State updated:', state);
});

// Update state directly
store.dispatch({ count: 1 });

// Dispatch an action (function)
store.dispatch((dispatch, getState) => {
    const currentCount = getState().count;
    dispatch({ count: currentCount + 1 });
});
```

---

## How the Framework Works

### DOM Abstraction (Virtual DOM)

The framework uses a virtual DOM system. When you call `createElement`, it creates a lightweight JavaScript object representing the desired DOM structure. The `render` function converts this virtual DOM into real DOM nodes. When the state changes, the framework compares the new virtual DOM with the previous one and updates only the parts of the real DOM that have changed, making updates efficient and fast.

**Example:**

```javascript
const vdom = createElement('div', { class: 'greeting' }, 'Hello!');
const realDom = render(vdom);
document.body.appendChild(realDom);
```

### Routing System

The router uses the browser's History API to keep the URL in sync with the app state. It maps paths to components and notifies subscribers when the route changes, allowing you to render different components based on the current path.

### State Management

The store holds the application state in a single object. You can update the state directly or by dispatching actions (functions). Subscribers are notified whenever the state changes, enabling reactive UI updates.

### Event Handling

The event bus provides a publish/subscribe mechanism for custom events, allowing components to communicate without direct references to each other. This decouples your code and makes it easier to manage complex interactions.

---

## TodoMVC Example

The framework includes a TodoMVC implementation that demonstrates all its features. To run the example:

```bash
npm start
```

Then open your browser to `http://localhost:3000`.

---

## FAQ

**Q: Is this a library or a framework?**
A: This is a framework. The control flow is inverted: the framework calls your code, not the other way around.

**Q: Can I use this with React/Vue/Angular?**
A: No. This framework is designed to be standalone and does not depend on or interoperate with other high-level frameworks.

**Q: How do I create a new component?**
A: Just write a function that returns a virtual DOM node using `createElement`.

---