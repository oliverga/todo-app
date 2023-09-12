"use strict"; // Enforce strict mode in JavaScript

// Retrieve todos and id from local storage or initialize as empty array and 0 respectively
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let id = JSON.parse(localStorage.getItem('id')) || 0;

// Get input elements from the DOM
let todoInput = document.querySelector(".todo-input");
let quantityInput = document.querySelector(".quantity-input");
let quantityButton = document.querySelector(".quantity-button");

// Define Todo class with task, quantity, done status, and id properties
class Todo {
    constructor(task, quantity, done) {
        this.task = task;
        this.quantity = quantity;
        this.done = done;
        this.id = id++;
    }
}

// Add event listener for 'Enter' key press to add a new todo
window.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTodo(todoInput.value, quantityInput.value);
    }
});

// Function to add a new todo
function addTodo(task, quantity) {
    // Validate task input
    if (!task.trim()) {
        alert('Please enter a task.');
        return;
    }
    // Create new todo and add to todos array
    const todo = new Todo(task, quantity, false);
    todos.push(todo);
    // Update local storage
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('id', JSON.stringify(id));
    // Clear input fields
    todoInput.value = "";
    quantityInput.value = "";
    quantityInput.classList.add("hide");
    quantityButton.classList.remove("hide");
    // Update todo lists in the DOM
    updateTodoLists();
}

// Function to mark a todo as done
function markAsDone(id) {
    // Find the todo with the given id
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        // Toggle done status
        todo.done = !todo.done;
        // Update todo lists in the DOM
        updateTodoLists();
    }
}

// Function to delete a todo by id
function deleteTodoById(id) {
    // Filter out the todo with the given id
    todos = todos.filter(todo => todo.id !== id);
    // Update local storage
    localStorage.setItem('todos', JSON.stringify(todos));
    // Update todo lists in the DOM
    updateTodoLists();
}

// Function to remove all done todos
function removeDone() {
    // Filter out done todos
    todos = todos.filter(todo => !todo.done);
    // Update local storage
    localStorage.setItem('todos', JSON.stringify(todos));
    // Update todo lists in the DOM
    updateTodoLists();
}

function createTodoElement(todo) {
    const template = document.querySelector('#todo-item-template');
    const todoElement = template.content.cloneNode(true);
    const checkbox = todoElement.querySelector('.todo-checkbox');
    const task = todoElement.querySelector('.todo-task');
    const quantity = todoElement.querySelector('.todo-quantity');
    const deleteButton = todoElement.querySelector('.delete-button');

    checkbox.dataset.id = todo.id;
    checkbox.checked = todo.done;
    checkbox.onchange = function() { markAsDone(todo.id); };
    task.textContent = todo.task;

    if (todo.quantity) {
        quantity.textContent = todo.quantity;
    } else {
        quantity.remove();
    }

    deleteButton.dataset.id = todo.id;
    deleteButton.onclick = function() { deleteTodoById(todo.id); };

    return todoElement;
}

// Function to update todo lists in the DOM
function updateTodoLists() {
    // Get list elements and remove done button from the DOM
    const todoList = document.querySelector(".todo-list");
    const doneList = document.querySelector(".done-list");
    const removeDoneButton = document.querySelector(".remove-done-button");
    // Clear list elements
    todoList.innerHTML = "";
    doneList.innerHTML = "";
    let doneItemsExist = false;
    // Iterate over todos and create list items
    todos.forEach(todo => {
        const li = createTodoElement(todo);
        // Add list item to done list if todo is done, otherwise add to todo list
        if (todo.done) {
            doneList.appendChild(li);
            doneItemsExist = true;
        } else {
            todoList.appendChild(li);
        }
    });
    // Show remove done button if there are done items, otherwise hide
    if (doneItemsExist) {
        removeDoneButton.classList.remove("hide");
    } else {
        removeDoneButton.classList.add("hide");
    }
    // Update local storage
    localStorage.setItem('todos', JSON.stringify(todos));
}


// Event listener to show quantity input and hdide button when button is pressed
quantityButton.addEventListener('click', function() {
    quantityInput.classList.toggle("hide");
    quantityButton.classList.toggle("hide");
    quantityInput.focus();
});

// Focus on todo input field and update todo lists in the DOM on load
todoInput.focus();
updateTodoLists();