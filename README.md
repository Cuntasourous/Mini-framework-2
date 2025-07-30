
# Mini Framework

> A minimal JavaScript mini-framework for building interactive web applications without heavy dependencies. It features a virtual DOM renderer, URL-based routing, a simple global state store, and an event bus—offering full control with very little code.

---

## 🔧 What's Inside?

* **Virtual DOM Renderer** – Build UIs declaratively using plain JavaScript and diff updates efficiently.
* **Client-side Routing** – Sync views with URL paths using the browser History API.
* **Global State Store** – Track app-wide state and re-render on changes.
* **Event Bus** – Dispatch and listen to custom events across your app.

---

## 📦 Getting Started

Clone the repo and install any dependencies:

```bash
npm install
```

Then start the dev server:

```bash
npm start
```

Open in browser:

```
http://localhost:3000
```

---

## 📘 Usage Overview

### 📌 Virtual DOM: `createElement`

The core of the view system uses a function like this:

```js
createElement('tag', { attributes }, ...children)
```

Example:

```js
const heading = createElement('h2', { class: 'title' }, 'Welcome!');
```

You can nest elements to build full UI trees.

---

### ✍️ Handling Events

Just pass event listeners like `onclick`, `onkeydown`, etc., in the attributes object:

```js
createElement('button', {
  onclick: () => alert('Clicked!')
}, 'Click Me');
```

---

### 🌐 Routing

Route changes trigger UI updates. Define routes with components:

```js
const router = new Router({
  '/': HomePage,
  '/profile': ProfilePage,
  '*': NotFound
});

router.subscribe(component => {
  mount(component());
});
```

Navigate using:

```js
router.navigate('/profile');
```

---

### 🔄 State Management

The `Store` holds your entire app state and notifies subscribers on updates.

```js
const store = new Store({ count: 0 });

store.subscribe(state => {
  console.log('New state:', state);
});

store.dispatch({ count: 1 });
```

Supports functional dispatch too:

```js
store.dispatch((dispatch, getState) => {
  dispatch({ count: getState().count + 1 });
});
```

---

### 📡 Event Bus

For component-to-component communication:

```js
const bus = new EventBus();

bus.on('user:login', user => console.log('Logged in:', user));
bus.emit('user:login', { username: 'alice' });
```

---

## 🧠 How It Works

### Virtual DOM Rendering

Your UI is a pure description of the DOM. When the state updates, a new virtual DOM is compared against the previous one and only the necessary DOM mutations are performed.

### State-Driven UI

Everything is reactive. The store keeps the source of truth, and the UI re-renders automatically on state changes.

### URL-Synced Routing

Uses the History API under the hood. Changes to the route are reflected in the app and vice versa.

### Decoupled Events

The event bus offers a simple pub-sub pattern to decouple modules while keeping them in sync.

---

## ✅ Todo App Demo

See the complete example in the included TodoMVC clone. It demonstrates:

* Real-time editing
* Filters (All, Active, Completed)
* Routing via URL
* "Select All" logic
* Keyboard interactions

To try it:

```bash
npm start
```

Then go to `http://localhost:3000`.
