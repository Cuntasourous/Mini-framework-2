import { createElement, render } from './framework/dom.js';
import { Store } from './framework/store.js';
import { Router } from './framework/router.js';
import { EventBus } from './framework/events.js';

// Initialize store
const store = new Store({
    todos: [],
    filter: 'all',
    editingId: null,
    aboutVisits: 0,
});

// Initialize router
const router = new Router({
    '/': 'all',
    '/active': 'active',
    '/completed': 'completed',
    '/about': 'about',
});

// Initialize event bus
const eventBus = new EventBus();

// Todo component
function TodoItem({ todo, onToggle, onDestroy, onEditStart, onEditEnd, onEditCancel, editingId }) {
    //checks if Item is being edited
    const isEditing = editingId === todo.id;
    return createElement('li', {
        class: (todo.completed ? 'completed ' : '') + (isEditing ? 'editing' : '')
    },
        // <li> children
        createElement('input', {
            class: 'toggle',
            type: 'checkbox',
            checked: todo.completed,
            onchange: () => onToggle(todo.id)
        }),
        // checks if its being edited
        isEditing
            ? createElement('input', {
                class: 'edit',
                type: 'text',
                value: todo.title,
                autofocus: true,
                onkeydown: (e) => {
                    if (e.key === 'Enter') {
                        onEditEnd(todo.id, e.target.value.trim());
                    } else if (e.key === 'Escape') {
                        onEditCancel();
                    }
                },
                onblur: (e) => onEditEnd(todo.id, e.target.value.trim()),
                oninput: (e) => { e.target.value = e.target.value; }
            })
            : createElement('label', {
                ondblclick: () => onEditStart(todo.id)
            }, todo.title),
        createElement('button', {
            class: 'destroy',
            onclick: () => onDestroy(todo.id)
        }, '×')
    );
}

// Todo list component
function TodoList({ todos, filter, onToggle, onDestroy, onEditStart, onEditEnd, onEditCancel, editingId }) {
    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return createElement('ul', { class: 'todo-list' },
        ...filteredTodos.map(todo =>
            TodoItem({
                todo,
                onToggle,
                onDestroy,
                onEditStart,
                onEditEnd,
                onEditCancel,
                editingId
            })
        )
    );
}


// Footer component
function Footer({ todos, filter, onClearCompleted }) {
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.length - activeCount;

    return createElement('footer', { class: 'footer' },
        createElement('span', { class: 'todo-count' },
            createElement('strong', {}, activeCount),
            ' items left'
        ),
        createElement('ul', { class: 'filters' },
            createElement('li', {},
                createElement('a', {
                    href: '#/',
                    class: filter === 'all' ? 'selected' : '',
                    onclick: (e) => {
                        e.preventDefault();
                        router.navigate('/');
                    }
                }, 'All')
            ),
            createElement('li', {},
                createElement('a', {
                    href: '#/active',
                    class: filter === 'active' ? 'selected' : '',
                    onclick: (e) => {
                        e.preventDefault();
                        router.navigate('/active');
                    }
                }, 'Active')
            ),
            createElement('li', {},
                createElement('a', {
                    href: '#/completed',
                    class: filter === 'completed' ? 'selected' : '',
                    onclick: (e) => {
                        e.preventDefault();
                        router.navigate('/completed');
                    }
                }, 'Completed')
            ),
        ),
        completedCount > 0 && createElement('button', {
            class: 'clear-completed',
            onclick: onClearCompleted
        }, 'Clear completed')
    );
}

// Main app component
function App() {
    const state = store.getState();
    const { todos, filter, editingId } = state;

    function addTodo(title) {
        store.dispatch({
            todos: [...todos, {
                id: Date.now(),
                title,
                completed: false
            }]
        });
    }

    function toggleTodo(id) {
        store.dispatch({
            todos: todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        });
    }

    function destroyTodo(id) {
        store.dispatch({
            todos: todos.filter(todo => todo.id !== id)
        });
    }

    function clearCompleted() {
        store.dispatch({
            todos: todos.filter(todo => !todo.completed)
        });
    }

    function startEdit(id) {
        store.dispatch({ editingId: id });
    }

    function endEdit(id, newTitle) {
        if (newTitle) {
            store.dispatch({
                todos: todos.map(todo =>
                    todo.id === id ? { ...todo, title: newTitle } : todo
                ),
                editingId: null
            });
        } else {
            // If empty, remove the todo
            destroyTodo(id);
            store.dispatch({ editingId: null });
        }
    }

    function cancelEdit() {
        store.dispatch({ editingId: null });
    }

    // Select all handler
    function toggleSelectAll() {
        const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
        store.dispatch({
            todos: todos.map(todo => ({ ...todo, completed: !allCompleted }))
        });
    }

    //Used to reflect the state of the "select all" checkbox
    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

    return createElement('div', { class: 'todoapp' },
        createElement('div', { class: 'nav' },
            createElement('a', {
                href: '#/',
                onclick: (e) => {
                    e.preventDefault();
                    router.navigate('/');
                }
            }, 'Home'),
            createElement('a', {
                href: '#/about',
                onclick: (e) => {
                    e.preventDefault();
                    router.navigate('/about');
                }
            }, 'About Us')
        ),
        createElement('h4', {}, 'Write your first To-do List'),
        createElement('br', {}, ''),
        // Select All Checkbox/Button
        todos.length > 0 && createElement('div', { style: 'display: flex; align-items: center; margin-bottom: 10px;' },
            createElement('input', {
                type: 'checkbox',
                class: 'toggle-all',
                checked: allCompleted,
                onclick: toggleSelectAll,
                title: 'Select/Unselect All'
            }),
            createElement('label', { for: 'toggle-all', style: 'margin-left: 8px; cursor: pointer;' }, 'Select All')
        ),
        createElement('input', {
            class: 'new-todo',
            placeholder: 'What needs to be done?',
            onkeydown: (e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                    addTodo(e.target.value.trim());
                    e.target.value = '';
                }
            }
        }),
        TodoList({
            todos,
            filter,
            onToggle: toggleTodo,
            onDestroy: destroyTodo,
            onEditStart: startEdit,
            onEditEnd: endEdit,
            onEditCancel: cancelEdit,
            editingId
        }),
        todos.length > 0 && Footer({
            todos,
            filter,
            onClearCompleted: clearCompleted
        })
    );
}

// Helper to mount the app
function mountApp() {
    const root = document.getElementById('app');
    root.innerHTML = '';
    root.appendChild(render(App()));
}

mountApp();

function About(visits) {
    return createElement('div', { class: 'about-page' },
        createElement('h2', {}, 'About Us'),
        createElement('p', {}, 'This is a simple framework made for learning purposes.'),
        createElement('p', {}, `You have visited this page ${visits} time${visits === 1 ? '' : 's'}.`),
        createElement('button', {
            onclick: () => eventBus.emit('goHome')
        }, 'Go Home')
    );
}

function mountAbout() {
    const state = store.getState();
    const count = state.aboutVisits;

    store.dispatch({ aboutVisits: count + 1 });

    const root = document.getElementById('app');
    root.innerHTML = '';
    root.appendChild(render(About(count + 1)));
}


eventBus.on('goHome', () => {
    router.navigate('/');
});



// Subscribe to store changes
store.subscribe(mountApp);

// Subscribe to route changes
router.subscribe(route => {
    if (route === 'about') {
        mountAbout();
    } else {
        store.dispatch({ filter: route });
        mountApp();
    }
});
