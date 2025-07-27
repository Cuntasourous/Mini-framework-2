import { createElement, render } from './framework/dom.js';
import { Store } from './framework/store.js';
import { Router } from './framework/router.js';
import { EventBus } from './framework/events.js';

// Initialize store
const store = new Store({
    todos: [],
    filter: 'all',
    editingId: null
});

// Initialize router
const router = new Router({
    '/': 'all',
    '/active': 'active',
    '/completed': 'completed'
});

// Initialize event bus
const eventBus = new EventBus();

// Todo component
function TodoItem({ todo, onToggle, onDestroy, onEditStart, onEditEnd, onEditCancel, editingId }) {
    const isEditing = editingId === todo.id;
    const checkboxId = `checkbox-${todo.id}`; // unique ID for label link

    return createElement('li', {
        class: (todo.completed ? 'completed ' : '') + (isEditing ? 'editing' : '')
    },
        // ✅ Custom checkbox with animation
        createElement('div', { class: 'checkbox-wrapper-19' },
            createElement('input', {
                type: 'checkbox',
                id: checkboxId,
                checked: todo.completed,
                onchange: () => onToggle(todo.id)
            }),
            createElement('label', {
                class: 'check-box',
                for: checkboxId
            })
        ),

        // 📝 Edit input or static label
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

        // ❌ Destroy button
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
            )
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

    return createElement('div', { class: 'todoapp' },
        createElement('h4', {}, 'Write your first To-do List'),
        createElement('input', {
            class: 'new-todo',
            placeholder: 'your todo here',
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

// Subscribe to store changes
store.subscribe(mountApp);

// Subscribe to route changes
router.subscribe(route => {
    store.dispatch({ filter: route });
}); 