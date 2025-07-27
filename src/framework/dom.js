// Virtual DOM implementation
class VNode {
    constructor(tag, attrs = {}, children = []) {
        this.tag = tag;
        this.attrs = attrs || {};
        this.children = children;
    }
}

// Create a virtual DOM node
export function createElement(tag, attrs = {}, ...children) {
    return new VNode(tag, attrs, children.flat());
}

// Convert virtual DOM to real DOM
export function render(vnode) {
    //if its string or number and convert it to html text like "Hello".
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return document.createTextNode(vnode);
    }
    //if the tag or whole node is empty, return nothing
    if (!vnode || !vnode.tag) {
        return document.createTextNode('');
    }
    //create the actual element from the tag
    const element = document.createElement(vnode.tag);

    // Set attributes
    if (vnode.attrs) {
        for (const [key, value] of Object.entries(vnode.attrs)) {
            if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else if (key === 'checked' && vnode.tag === 'input') {
                element.checked = !!value;
            } else if (value !== undefined && value !== null) {
                element.setAttribute(key, value);
            }
        }
    }

    // Render children
    if (vnode.children) {
        for (const child of vnode.children) {
            if (child !== undefined && child !== null) {
                element.appendChild(render(child));
            }
        }
    }

    return element;
}

// Update DOM based on virtual DOM changes
export function updateElement(parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        parent.appendChild(render(newNode));
    } else if (!newNode) {
        parent.removeChild(parent.childNodes[index]);
    } else if (changed(newNode, oldNode)) {
        parent.replaceChild(render(newNode), parent.childNodes[index]);
    } else if (newNode.tag) {
        const newLength = newNode.children ? newNode.children.length : 0;
        const oldLength = oldNode.children ? oldNode.children.length : 0;
        
        for (let i = 0; i < newLength || i < oldLength; i++) {
            updateElement(
                parent.childNodes[index],
                newNode.children ? newNode.children[i] : null,
                oldNode.children ? oldNode.children[i] : null,
                i
            );
        }
    }
}

// Check if nodes are different
function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
           typeof node1 === 'string' && node1 !== node2 ||
           node1.tag !== node2.tag;
} 
